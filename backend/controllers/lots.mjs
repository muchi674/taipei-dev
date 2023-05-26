import { lots, users } from "../utils/mongoDB.mjs";
import { HttpError } from "../utils/httpError.mjs";

async function createLot(req, res) {
  const { userId } = req.session;
  const session = mongoDBClient.startSession();

  try {
    session.startTransaction();

    const lotResult = await lots.insertOne(
      {
        name: req.body.name,
        minPrice: req.body.minPrice,
        maxPrice: req.body.maxPrice,
        smallestIncrement: req.body.smallestIncrement,
        maxWait: req.body.maxWait,
        expiresAt: req.body.expiresAt,
        createdAt: Date.now(),
        description: req.body.description,
      },
      { session }
    );

    await users.updateOne(
      { _id: userId },
      {
        $push: { lots: lotResult.insertedId },
      },
      { session }
    );
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    return next(new HttpError("Cannot Create Lot", 500));
  } finally {
    await session.endSession();
  }

  res.json({ lotId: lotResult.insertedId });
}

export { createLot };
