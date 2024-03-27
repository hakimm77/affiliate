import { doc, getDoc, setDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../utils/firebaseConfig";
import { v4 as uuid } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { walletAddress } = req.body;
  const userID = uuid();

  const userDoc = doc(db, "users", walletAddress);
  await getDoc(userDoc).then(async (response) => {
    if (response.exists()) {
      res.status(200).json(response.data());
    } else {
      await setDoc(doc(db, "users", walletAddress), {
        address: walletAddress,
        id: userID,
        tokens: 0,
        invited: 0,
      });

      res.status(200).json({
        address: walletAddress,
        id: userID,
        tokens: 0,
        invited: 0,
      });
    }
  });
}
