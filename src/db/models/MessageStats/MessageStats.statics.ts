import MessageStats from "./MessageStats.model";
import { IMessageStats, IShares } from "./MessageStats.types";

export async function getSharesByEpochForUser(
  this: typeof MessageStats,
  epoch: string,
  nullifier: string
): Promise<IShares[]> {
  return this.find(
    {
      epoch,
      nullifier,
    },
    { xShare: 1, yShare: 1 }
  );
}

export async function getByEpoch(
  this: typeof MessageStats,
  epoch: string
): Promise<IMessageStats[]> {
  return this.find({ epoch });
}

export async function isDuplicate(
  this: typeof MessageStats,
  rlnIdentifier: string,
  epoch: string,
  nullifier: string,
  xShare: string,
  yShare: string
): Promise<boolean> {
  const request = await this.findOne({
    rlnIdentifier,
    epoch,
    nullifier,
    xShare,
    yShare,
  });
  return request ? true : false;
}

export async function isSpam(
  this: typeof MessageStats,
  rlnIdentifier: string,
  epoch: string,
  nullifier: string,
  numRequests: number
): Promise<boolean> {
  const requests = await this.aggregate([
    {
      $match: {
        rlnIdentifier,
        epoch,
        nullifier,
      },
    },
    {
      $count: "num_requests",
    },
  ]);

  return requests.length === 1 && requests[0].num_requests >= numRequests;
}
