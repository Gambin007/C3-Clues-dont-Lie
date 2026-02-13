# Files Folder

This folder contains media files (images and audio) used in the chat application.

## Usage

1. Place image files (jpg, png, gif, etc.) in this folder
2. Place audio files (mp3, wav, ogg, etc.) in this folder
3. Reference them in `content/chat.json` using the path: `./files/filename.ext`

## Example

If you have a file named `photo.jpg` in this folder, reference it in chat.json as:
```json
{
  "type": "image",
  "content": "./files/photo.jpg",
  "filename": "photo.jpg"
}
```

For voice notes:
```json
{
  "type": "voice",
  "content": "./files/voice.mp3",
  "filename": "voice.mp3",
  "duration": "1:23"
}
```

## Adding Files via Chat

When you click the attach button (📎) in the chat:
1. Select a file from your computer
2. The system will create a reference to `./files/[filename]`
3. You need to manually copy the file to this folder
4. The file will then be accessible in the chat
