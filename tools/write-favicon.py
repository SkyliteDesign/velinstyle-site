#!/usr/bin/env python3
import struct
from pathlib import Path

path = Path(__file__).resolve().parent.parent / "favicon.ico"
w, h = 16, 16
pixels = bytearray()
for _ in range(h):
    for _ in range(w):
        pixels.extend((0xFF, 0x5C, 0x6D, 0xFF))
mask_row_size = ((w + 31) // 32) * 4
and_mask = bytes(mask_row_size * h)
bmp_header = struct.pack("<IIIHHIIIIII", 40, w, h * 2, 1, 32, 0, len(pixels), 0, 0, 0, 0)
image_data = bmp_header + bytes(pixels) + and_mask
offset = 6 + 16
ico = struct.pack("<HHH", 0, 1, 1)
ico += struct.pack("<BBBBHHII", w, h, 0, 0, 1, 32, len(image_data), offset)
ico += image_data
path.write_bytes(ico)
print("wrote", path)
