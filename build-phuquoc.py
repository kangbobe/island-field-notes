"""Build the trip-specific standalone page; run instead of the legacy build.py."""
from pathlib import Path
import json,re,base64

root=Path(__file__).resolve().parent
previous=(root/'index.html').read_text()
embedded=re.search(r'const PHOTOS=(\{.*?\});\s*</script>',previous,re.S)
if embedded:
    photos=json.loads(embedded.group(1))
    leaflet_css=re.search(r'<style>(.*?)</style>',previous,re.S).group(1)
    leaflet_js=next(s for s in re.findall(r'<script>(.*?)</script>',previous,re.S) if 'Leaflet 1.9.4' in s)
else:
    data=(root/'data.js').read_text()
    meta=json.loads(re.search(r'const IMG=(\{.*?\});\n',data,re.S).group(1))
    photos={}
    for key in ['photo1','cable','sao','longsun','photo7','photo2']:
        p=dict(meta[key])
        p['file']='data:image/jpeg;base64,'+base64.b64encode((root/'assets'/p['file']).read_bytes()).decode()
        photos[key]=p
    leaflet_css=(root/'vendor/leaflet.css').read_text()
    leaflet_js=(root/'vendor/leaflet.js').read_text()
template=(root/'pq-template.html').read_text()
replacements={
'/*LEAFLET_CSS*/':leaflet_css,
'/*PQ_CSS*/':(root/'pq.css').read_text(),
'/*PHOTOS*/':'const PHOTOS='+json.dumps(photos,ensure_ascii=False)+';',
'/*LEAFLET_JS*/':leaflet_js,
'/*PQ_DATA*/':(root/'pq-data.js').read_text(),
'/*PQ_CORE*/':(root/'pq-core.js').read_text(),
'/*PQ_APP*/':(root/'pq-app.js').read_text(),
}
for marker,value in replacements.items():
    assert marker in template,marker
    template=template.replace(marker,value)
assert not re.search(r'/\*[A-Z_]+\*/',template)
(root/'index.html').write_text(template)
print('Built Phu Quoc standalone:',len(template.encode()),'bytes')
