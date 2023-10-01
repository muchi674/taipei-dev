import { ObjectId } from "mongodb";

import { mongoDBClient, lots, bids, timers } from "../utils/mongoDB.mjs";
import { HttpError } from "../utils/httpError.mjs";

async function createBid(req, res) {
  const { userId } = req.session;
  const lotId = new ObjectId(req.body.lotId);
  let lot;

  /*
  needs values from lot for input validation and calculating
  some of the fields in bid
  */
  try {
    lot = await lots.findOne(
      { _id: lotId },
      { minPrice: 1, maxPrice: 1, step: 1, maxWait: 1, expiresAt: 1 }
    );
  } catch (error) {
    return next(new HttpError("Cannot get associated lot", 500));
  }

  const bidCreatedAt = Date.now();

  // input validation
  if (lot === null) {
    return next(new HttpError("Lot deleted", 404));
  } else if (
    req.body.price < lot.minPrice ||
    req.body.price > lot.maxPrice ||
    (lot.maxPrice - req.body.price) % lot.step !== 0
  ) {
    return next(new HttpError("Invalid price", 400));
  } else if (bidCreatedAt >= lot.expiresAt) {
    return next(new HttpError("Lot expired", 400));
  }

  const session = mongoDBClient.startSession();

  try {
    session.startTransaction();

    const hammerAt =
      req.body.price === lot.maxPrice
        ? bidCreatedAt
        : Math.min(bidCreatedAt + lot.maxWait * 60 * 1000, lot.expiresAt);
    const bidInsert = await bids.insertOne(
      {
        lotId,
        userId,
        price: req.body.price,
        createdAt: bidCreatedAt,
      },
      { session }
    );
    const lotUpdate = await lots.updateOne(
      {
        _id: lotId,
        $or: [
          { winningBidId: { $exist: false } },
          {
            winningBidPrice: { $lt: req.body.price },
            hammerAt: { $lt: bidCreatedAt },
          },
        ],
      },
      {
        $set: {
          winningBidId: bidInsert.insertedId,
          winningBidPrice: req.body.price,
          hammerAt,
        },
        $push: { bids: bidInsert.insertedId },
      },
      { session }
    );

    if (lotUpdate.matchedCount === 0) {
      // delete invalid bid
      await bids.deleteOne({ _id: bidInsert.insertedId }, { session });
      throw new Error("Oops, you were outbid");
    }

    await timers.insertOne(
      {
        setByResource: "bid",
        setByAction: "create",
        lotId,
        bidId: bidInsert.insertedId,
        expiresAt: hammerAt,
      },
      { session }
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    return next(new HttpError(error.message, 500));
  } finally {
    await session.endSession();
  }

  res.json({ bidId });
}

export { createBid };
