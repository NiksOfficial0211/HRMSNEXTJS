// // src/app/api/uploads/route.ts
// import fs from 'fs';
// import path from 'path';
// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(req: NextRequest) {
//   console.log("GET request received for image download");
  
//   const url = new URL(req.url);
//   const imagePath = url.searchParams.get('imagePath');

//   if (!imagePath) {
//     return NextResponse.json({ error: 'Image path is required' }, { status: 400 });
//   }

//   const filePath = path.join(process.cwd(), 'uploads', imagePath);

//   if (!fs.existsSync(filePath)) {
//     return NextResponse.json({ error: 'Image not found' }, { status: 404 });
//   }

//   const ext = path.extname(filePath).toLowerCase();
//   const mimeTypes: Record<string, string> = {
//     '.jpg': 'image/jpeg',
//     '.jpeg': 'image/jpeg',
//     '.png': 'image/png',
//     '.webp': 'image/webp',
//     '.gif': 'image/gif',
//     '.pdf': 'application/pdf',
//     '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     '.doc': 'application/msword',
//     '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     '.xls': 'application/vnd.ms-excel',
//     '.csv': 'text/csv',
//     '.txt': 'text/plain',
//   };

//   const contentType = mimeTypes[ext] || 'application/octet-stream';

//   const fileBuffer = fs.readFileSync(filePath);
//   return new NextResponse(fileBuffer, {
//     status: 200,
//     headers: {
//       'Content-Type': contentType,
//       'Content-Disposition': `inline; filename="${path.basename(filePath)}"`,

//     },
//   });
// }



// src/app/api/uploads/route.ts
import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const rawPath = url.searchParams.get('imagePath');

  if (!rawPath) {
    return NextResponse.json({ error: 'URl is not present' }, { status: 400 });
  }

  let imagePath = rawPath.replace(/\\/g, '/'); // Normalize Windows slashes

  let baseFolder = '';
  let relativePath = '';
  // const filePath = path.join(process.cwd(), 'uploads', imagePath);
  if (imagePath.includes('/uploads/')) {
    baseFolder = 'uploads';
    relativePath = imagePath.split('/uploads/')[1];
  } else if (imagePath.includes('/sampleFiles/')) {
    baseFolder = 'sampleFiles';
    relativePath = imagePath.split('/sampleFiles/')[1];
  } else {
    return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), baseFolder, relativePath);
  console.log('Resolved file path:', filePath);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.doc': 'application/msword',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xls': 'application/vnd.ms-excel',
    '.csv': 'text/csv',
    '.txt': 'text/plain',
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';

  const fileBuffer = fs.readFileSync(filePath);
  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${path.basename(filePath)}"`,

    },
  });
}

