import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const file = searchParams.get('file');

        if (!file) {
            return NextResponse.json(
                { error: 'File parameter is required' },
                { status: 400 }
            );
        }

        // Security: Prevent directory traversal attacks
        const sanitizedFile = file.replace(/\.\./g, '').replace(/^\//, '');

        // Only allow .md files from the docs directory
        if (!sanitizedFile.endsWith('.md') || sanitizedFile.includes('..')) {
            return NextResponse.json(
                { error: 'Invalid file path' },
                { status: 400 }
            );
        }

        // Construct the file path
        const filePath = join(process.cwd(), 'docs', sanitizedFile);

        // Read the markdown file
        const content = await readFile(filePath, 'utf-8');

        return NextResponse.json({ content });
    } catch (error) {
        console.error('Error reading markdown file:', error);

        if (error instanceof Error && error.message.includes('ENOENT')) {
            return NextResponse.json(
                { error: 'Documentation file not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 