import { lots, users } from "../utils/mongoDB.mjs";
import { HttpError } from "../utils/httpError.mjs";

async function createLot(req, res, next) {
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
        maxAge: req.body.maxAge,
        createdAt: Date.now(),
        description: req.body.description,
        photoS3Keys: req.body.photoS3Keys,
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

  next();
}

export { createLot };
