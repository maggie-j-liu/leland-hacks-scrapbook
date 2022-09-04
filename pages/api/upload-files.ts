import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import cloudinary from "cloudinary";

//set bodyparser
export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,

  api_key: process.env.CLOUDINARY_API_KEY,

  api_secret: process.env.CLOUDINARY_API_SECRET,

  secure: true,
});

interface Media {
  url: string;
  mediaType: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const { files } = req.body;

  let data = await new Promise((resolve, reject) => {
    const form = formidable();

    form.parse(req, (err: any, fields: any, files: any) => {
      if (err) reject({ err });
      resolve({ err, fields, files });
    });
  });

  let { files } = data;

  if (!Array.isArray(files)) {
    files = [files];
  }

  console.log(JSON.stringify(files));

  let media: Media[] = [];
  for (const file of files) {
    console.log(file);
    cloudinary.v2.uploader.upload(
      file.files.path,

      async function (error: any, result: any) {
        console.log(result, error);

        if (!error) {
          media.push({ url: result.url, mediaType: result.resource_type });
          res.redirect("/");
        }
      }
    );
  }

  res.json(media);

  // console.log(files, req.body);
  res.end();
}
