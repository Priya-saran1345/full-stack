import mongoose, { Schema } from 'mongoose';
  const PostSchema: Schema = new Schema(
{
        title:String,
        content:String,
        id:String, 

})
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
export default Post;
