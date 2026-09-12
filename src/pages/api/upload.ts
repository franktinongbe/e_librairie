import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { ensureAdmin } from '../../lib/auth';

type UploadBody = {
  file: string; // data URL or base64
  name?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // admin only
  if (!ensureAdmin(req, res)) return;

  try {
    const body = req.body as UploadBody;
    if (!body || !body.file) return res.status(400).json({ error: 'No file provided' });

    // parse data URL if present
    let matches = body.file.match(/^data:(.+);base64,(.*)$/);
    let base64: string;
    let mime = 'application/octet-stream';
    if (matches) {
      mime = matches[1];
      base64 = matches[2];
    } else {
      // assume raw base64
      base64 = body.file;
    }

    const ext = (mime.split('/')[1] || 'bin').replace(/[^a-z0-9]/gi, '');
    const fileName = `${Date.now()}-${Math.round(Math.random()*1e6)}${body.name ? '-' + body.name.replace(/[^a-z0-9.\-]/gi,'') : ''}.${ext}`;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, fileName);
    const buffer = Buffer.from(base64, 'base64');
    fs.writeFileSync(filePath, buffer);

    const url = `/uploads/${fileName}`;
    res.status(200).json({ url });
  } catch (err) {
    console.error('upload error', err);
    res.status(500).json({ error: 'Upload failed' });
  }
}
