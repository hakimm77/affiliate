import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../utils/firebaseConfig";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { refWallet, transactionAmount, buyerWallet } = req.body;

  const userDoc = doc(db, "users", refWallet);
  await getDoc(userDoc).then(async (response) => {
    if (response.exists() && buyerWallet !== refWallet) {
      let userPreviousData = response.data();

      await setDoc(doc(db, "users", refWallet), {
        address: userPreviousData.address,
        id: userPreviousData.id,
        invited: userPreviousData.invited + 1,
        tokens: userPreviousData.tokens + transactionAmount * 0.025,
      });

      res.status(200).json({
        msg: "updated",
      });
    } else {
      res.status(200).json({ ref: "no ref found" });
    }
  });
}
