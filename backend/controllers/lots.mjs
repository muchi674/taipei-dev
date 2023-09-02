import { ObjectId } from "mongodb";

import { lots } from "../utils/mongoDB.mjs";
import { HttpError } from "../utils/httpError.mjs";

async function createLot(req, res) {
  const { userId } = req.session;
  let lotId;

  try {
    const result = await lots.insertOne({
      name: req.body.name,
      minPrice: req.body.minPrice,
      maxPrice: req.body.maxPrice,
      step: req.body.step,
      maxWait: req.body.maxWait,
      expiresAt: req.body.expiresAt,
      createdAt: Date.now(),
      description: req.body.description,
      userId,
    });

    lotId = result.insertedId;
  } catch (error) {
    return next(new HttpError("Cannot Create Lot", 500));
  }

  res.json({ lotId });
}

async function readLots(req, res, next) {
  const { userId } = req.session;
  let cursor;
  let data;

  try {
    cursor = lots.find(
      { userId },
      {
        sort: { expiresAt: 1 },
        projection: { userId: 0 },
      }
    );
    data = await cursor.toArray();
  } catch (error) {
    return next(new HttpError("Cannot Read Lots", 500));
  } finally {
    await cursor.close();
  }

  res.json({ data });
}

async function updateLot(req, res, next) {
  const { lotId } = req.params;

  if (req.body.expiresAt <= Date.now()) {
    return next(new HttpError("expiration datetime <= now", 400));
  }

  try {
    const result = await lots.updateOne(
      { _id: new ObjectId(lotId) },
      {
        $set: {
          expiresAt: req.body.expiresAt,
          lastUpdatedAt: Date.now(),
          description: req.body.description,
        },
      }
    );

    if (result.matchedCount === 0) {
      return next(new HttpError("Cannot Find Lot to Update", 400));
    }
  } catch (error) {
    return next(new HttpError("Cannot Update Lot", 500));
  }

  res.end();
}

async function deleteLot(req, res, next) {
  const { lotId } = req.params;

  try {
    const result = await lots.deleteOne({ _id: new ObjectId(lotId) });

    if (result.deletedCount === 0) {
      return next(new HttpError("Cannot Find Lot to Delete", 400));
    }
  } catch (error) {
    return next(new HttpError("Cannot Delete Lot", 500));
  }

  res.end();
}

export { createLot, readLots, updateLot, deleteLot };
