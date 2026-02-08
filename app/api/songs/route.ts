import { NextResponse } from 'next/server'

interface Song {
  id: string
  title: string
  artist: string
  cover?: string
  audioUrl?: string
  embedUrl?: string
}

export async function GET() {
  const songs: Song[] = [
    {
      id: '1',
      title: 'Then Again',
      artist: 'Lisa',
      cover: '🎵',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    {
      id: '2',
      title: 'Memories',
      artist: 'Various',
      cover: '🎵',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
    {
      id: '3',
      title: 'Quiet Moments',
      artist: 'Lisa',
      cover: '🎵',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    },
    {
      id: '4',
      title: 'For You',
      artist: 'Lisa',
      cover: '🎵',
    },
    {
      id: '5',
      title: 'Home – Live Version',
      artist: 'Lisa',
      cover: '🎵',
    },
    {
      id: '6',
      title: 'Lost in Thought',
      artist: 'Various',
      cover: '🎵',
    },
    {
      id: '7',
      title: 'Morning Coffee',
      artist: 'Various',
      cover: '🎵',
    },
    {
      id: '8',
      title: 'Focus',
      artist: 'Various',
      cover: '🎵',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    {
      id: '9',
      title: 'Background',
      artist: 'Various',
      cover: '🎵',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
    {
      id: '10',
      title: 'Thinking',
      artist: 'Various',
      cover: '🎵',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    },
    {
      id: 'universe',
      title: 'Us emene lääre Gygechaschte',
      artist: 'Mani Matter',
      cover: '🎵',
      audioUrl: '/media/audio/Mani_Matter.mp3',
    },
    {
      id: '12',
      title: 'Deep Dive',
      artist: 'Various',
      cover: '🎵',
    },
    {
      id: '13',
      title: 'Research Mode',
      artist: 'Various',
      cover: '🎵',
    },
    {
      id: '14',
      title: 'Chill',
      artist: 'Various',
      cover: '🎵',
    },
    {
      id: '15',
      title: 'Relax',
      artist: 'Various',
      cover: '🎵',
    },
    {
      id: '16',
      title: 'Midnight',
      artist: 'Various',
      cover: '🎵',
    },
    {
      id: '17',
      title: 'Dreams',
      artist: 'Various',
      cover: '🎵',
    },
    {
      id: '18',
      title: 'Light Years',
      artist: 'Various',
      cover: '🎵',
    },
    {
      id: '19',
      title: 'Summer Vibes',
      artist: 'Various',
      cover: '🎵',
    },
    {
      id: '20',
      title: 'City Lights',
      artist: 'Various',
      cover: '🎵',
    },
    {
      id: '21',
      title: 'Ocean Waves',
      artist: 'Various',
      cover: '🎵',
    },
    {
      id: '22',
      title: 'Lonely Road',
      artist: 'Various',
      cover: '🎵',
    },
  ]

  return NextResponse.json(songs)
}
