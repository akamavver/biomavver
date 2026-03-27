import os
import shutil
from PIL import Image, ImageFilter
import json

INPUT_DIR = os.path.join('Images', 'mavver')
OUTPUT_DIR = 'build'
IMG_OUTPUT = os.path.join(OUTPUT_DIR, 'assets')
BLUR_OUTPUT = os.path.join(OUTPUT_DIR, 'blur')
TEMPLATE_NAME = 'template.html'
CSS_NAME = 'style.css'

def build():
    if not os.path.exists(INPUT_DIR):
        print("Папка не найдена")
        return

    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)

    os.makedirs(IMG_OUTPUT)
    os.makedirs(BLUR_OUTPUT)

    valid_exts = ('.jpg', '.jpeg', '.png', '.webp', '.heic')
    raw_files = [f for f in os.listdir(INPUT_DIR) if f.lower().endswith(valid_exts)]

    processed = []

    for i, name in enumerate(raw_files):
        input_path = os.path.join(INPUT_DIR, name)
        new_name = f"img_{i}.jpg"

        full_path = os.path.join(IMG_OUTPUT, new_name)
        blur_path = os.path.join(BLUR_OUTPUT, new_name)

        with Image.open(input_path) as img:
            img = img.convert('RGB')

            # FULL
            img.save(full_path, 'JPEG', quality=85)

            # BLUR
            small = img.resize((40, 40))
            small = small.filter(ImageFilter.GaussianBlur(6))
            small.save(blur_path, 'JPEG', quality=30)

        processed.append(new_name)

    shutil.copy(CSS_NAME, os.path.join(OUTPUT_DIR, CSS_NAME))

    with open(TEMPLATE_NAME, 'r', encoding='utf-8') as f:
        content = f.read()
        content = content.replace('{{IMAGES}}', json.dumps(processed))

    with open(os.path.join(OUTPUT_DIR, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(content)

    print("Сайт собран!")

if __name__ == "__main__":
    build()