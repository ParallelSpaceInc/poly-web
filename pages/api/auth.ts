import {supabase} from "@supabase/client";
import {NextApiRequest, NextApiResponse} from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  supabase.auth.api.setAuthCookie(req, res)
}