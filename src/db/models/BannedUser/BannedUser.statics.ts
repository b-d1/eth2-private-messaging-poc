import BannedUser from "./BannedUser.model";

export async function getTotalBannedUsers(
  this: typeof BannedUser
): Promise<number> {
  return this.countDocuments({});
}

export async function isBanned(
  this: typeof BannedUser,
  idCommitment: string
): Promise<boolean> {
  const user = await this.findOne({ idCommitment });
  return !!user;
}
