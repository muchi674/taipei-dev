import { mongoDBClient, users, lots } from "../utils/mongoDB.mjs";
import { HttpError } from "../utils/httpError.mjs";

async function createLot(req, res) {
  const { userId } = req.session;
  const session = mongoDBClient.startSession();
  let lotId;

  try {
    session.startTransaction();

    const lotResult = await lots.insertOne(
      {
        name: req.body.name,
        minPrice: req.body.minPrice,
        maxPrice: req.body.maxPrice,
        step: req.body.step,
        maxWait: req.body.maxWait,
        expiresAt: new Date(req.body.expiresAt),
        createdAt: Date.now(),
        description: req.body.description,
      },
      { session }
    );

    lotId = lotResult.insertedId;

    await users.updateOne(
      { _id: userId },
      {
        $push: { lots: lotId },
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

  res.json({ lotId });
}

export { createLot };
