# Sound Effects Directory

This directory contains audio files for the Real Mint app's sound effects system.

## Required Audio Files

The following audio files should be placed in this directory for the complete sound experience:

### Reward Collection Sounds
- `coin-collect.mp3` - Common reward sound (light coin sound)
- `chime-success.mp3` - Rare reward sound (pleasant chime)
- `magic-sparkle.mp3` - Epic reward sound (magical sparkle)
- `fanfare-victory.mp3` - Legendary reward sound (victory fanfare)
- `crystal-chime.mp3` - Special reward sound (crystal chime)

### Action Sounds
- `beep-scan.mp3` - Successful QR code scan
- `error-buzz.mp3` - Failed scan or error
- `video-complete.mp3` - Video watching completed
- `location-ping.mp3` - Successful location check-in

### UI Feedback Sounds
- `click-soft.mp3` - Button clicks
- `whoosh-light.mp3` - Tab switching
- `achievement-bell.mp3` - Achievement unlocked
- `bonus-ding.mp3` - Streak bonus earned

## Audio Specifications

**Recommended Format**: MP3
**Sample Rate**: 44.1kHz or 22.05kHz
**Bit Rate**: 128kbps (balance of quality and file size)
**Duration**: 0.1s - 1.0s (short feedback sounds)
**Volume**: Normalized to prevent clipping

## Fallback System

If audio files are not available, the app will automatically use Web Audio API generated tones as fallbacks. This ensures functionality even without the audio files.

## Sources for Free Audio

- **Freesound.org** - Creative Commons licensed sounds
- **Zapsplat** - Free with account registration
- **Adobe Audition** - Built-in sound library
- **GarageBand** - Built-in sound effects (Mac)

## File Size Considerations

Keep individual files under 50KB for optimal loading performance. The sound system preloads frequently used sounds to minimize latency.