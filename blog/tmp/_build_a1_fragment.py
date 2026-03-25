import re
import pathlib

root = pathlib.Path(__file__).resolve().parents[1]
raw = (root / "tmp" / "archive-article-davide.html").read_text(encoding="utf-8")
# First HTML document only (file mistakenly contains a second <!DOCTYPE>)
pos = raw.find("<!DOCTYPE html>", 20)
if pos != -1:
    raw = raw[:pos]
inner = raw.split("<article>", 1)[1].split("</article>", 1)[0]
inner = re.sub(r'href="\[[^\]]+\]\((https?://[^)]+)\)"', r'href="\1"', inner)
inner = inner.replace('"@context":"[schema.org](https://schema.org)"', '"@context":"https://schema.org"')
inner = inner.replace(
    '<footer style="margin-top:3em;border-top:2px solid #eee;padding-top:1em;font-size:0.95em">',
    '<div class="blog-byline">',
)
inner = inner.replace(
    '<p style="text-align:center;margin-top:1em;color:#555">',
    '<p class="text-center mt-4 text-on-surface-variant">',
)
inner = inner.replace("</footer>", "</div>")
inner = inner.replace('class="lead"', 'class="blog-lead"')
inner = inner.replace(
    'href="https://rankhotel.ai/servizi/ottimizzazione-ai"',
    'href="../../#trial"',
)
(root / "tmp" / "_fragment_a1_it.html").write_text(inner, encoding="utf-8")
print("ok", len(inner))
