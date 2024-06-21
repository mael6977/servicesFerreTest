import mongoose, { Document} from "mongoose";

export interface IAudit extends Document {
  auditor: mongoose.Types.ObjectId;
  business: mongoose.Types.ObjectId;
  visit: number;
  visitDay: Date;
  answer0: string;
  commentAnswer0: string;
  answer1: string;
  commentAnswer1: string;
  answer2: string;
  commentAnswer2: string;
  answer3: string;
  commentAnswer3: string;
  answer4: string;
  commentAnswer4: string;
  answer5: string;
  commentAnswer5: string;
  answer6: string;
  commentAnswer6: string;
  answer7: string;
  commentAnswer7: string;
  answer8: string;
  commentAnswer8: string;
  created_date: Date;
  update_date: Date;
};
