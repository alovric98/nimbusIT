#!/usr/bin/env python3
"""Generate bilingual static pages from templates/data using only Python's stdlib."""
from pathlib import Path
from html import escape as esc
import hashlib, json, re, sys
ROOT = Path(__file__).resolve().parent.parent
T = ROOT / 'templates'
SITE = json.loads((ROOT/'data/site.json').read_text())
PRICING = json.loads((ROOT/'data/pricing.json').read_text())
REVIEWS = json.loads((ROOT/'data/reviews.json').read_text())
FAQ = json.loads((ROOT/'data/home-faq.json').read_text())
DOMAIN = SITE['domain']
OUTPUTS = {}

def asset(path):
    data=(ROOT/path.lstrip('/')).read_bytes()
    return path+'?v='+hashlib.sha256(data).hexdigest()[:12]

def price(value, lang='hr'):
    assert type(value) is int and value>0
    return f'{value:,}'.replace(',','.')+' €' if lang=='hr' else f'€{value:,}'

def local(obj,key,lang): return obj.get(key+'_hr',obj.get(key,'')) if lang=='hr' else obj.get(key,'')
def partial(name): return (T/'partials'/name).read_text()
def render(text, values):
    return re.sub(r'\{\{([A-Z0-9_]+)\}\}',lambda m:str(values.get(m[1],m[0])),text)
def photo(lang='hr'):
    src=SITE['photo'];path=ROOT/src.lstrip('/')
    if path.is_file(): return f'<figure class="portrait"><img src="{esc(src)}" alt="Antonio Lovrić, NimbusIT" width="400" height="400" loading="lazy"></figure>'
    return '<figure class="portrait portrait--fallback"><span class="pixel" aria-hidden="true">AL</span><figcaption>'+('Antonio Lovrić · fotografija nije dodana' if lang=='hr' else 'Antonio Lovrić · photo not supplied')+'</figcaption></figure>'
def owner_card(lang='hr'):
    return '<div class="owner-card">'+photo(lang)+'<div><strong>'+esc(SITE['owner'])+'</strong><p>'+('Radite izravno sa mnom' if lang=='hr' else 'You’ll work directly with me')+'</p></div><div class="owner-actions"><a href="tel:'+esc(SITE['phone_e164'])+'">'+('Nazovite' if lang=='hr' else 'Call')+'</a><a href="'+esc(SITE['whatsapp'])+'" target="_blank" rel="noopener noreferrer">WhatsApp</a></div></div>'
def faq_html(items): return ''.join('<details><summary>'+esc(q['q'])+'<span aria-hidden="true">+</span></summary><div><p>'+esc(q['a'])+'</p></div></details>' for q in items)
def prices(lang):
    cards=[]
    for p in PRICING['packages']:
        values={'label':local(p,'label',lang),'name':local(p,'name',lang),'description':local(p,'description',lang),'summary':local(p,'summary',lang)}
        items=''.join('<li>'+esc(x)+'</li>' for x in local(p,'scope',lang))
        note='' if lang=='hr' else '<p class="package__note">'+esc(p['note'])+'</p>'
        cards.append(f'''<article class="package{' package--featured' if p.get('featured') else ''}"><p class="eyebrow">{esc(values['label'])}</p><h3>{esc(values['name'])}</h3><p class="package__description">{esc(values['description'])}</p><p class="price"><span>{'od' if lang=='hr' else 'from'}</span> {price(p['price'],lang)}</p><p class="price-caption">{'jednokratna izrada' if lang=='hr' else 'one-time build'}</p><p class="package__scope-summary">{esc(values['summary'])}</p><details class="package__details"><summary>{'Cijeli opseg' if lang=='hr' else 'Full scope'} <span aria-hidden="true">+</span></summary><ul class="checklist">{items}</ul>{note}</details><a class="button {'button--ink' if p.get('featured') else 'button--white'}" href="{'#kontakt' if lang=='hr' else '#contact'}" data-package="{esc(values['name'])}" aria-label="{'Razgovarajmo o paketu' if lang=='hr' else 'Discuss'}: {esc(values['name'])}">{'Javite se' if lang=='hr' else 'Let’s talk'} <span aria-hidden="true">↗</span></a></article>''')
    monthly=''.join(f'<div class="monthly__row"><dt>{esc(local(p,"name",lang))}<span>{esc(local(p,"scope",lang))}</span></dt><dd>{"od" if lang=="hr" else "from"} {price(p["price"],lang)}<span> / {"mj." if lang=="hr" else "month"}</span></dd></div>' for p in PRICING['monthly'])
    return {'PACKAGES':'\n'.join(cards),'MONTHLY':monthly,'STRATEGY_NAME':esc(local(PRICING['strategy'],'name',lang)),'STRATEGY_SCOPE':esc(local(PRICING['strategy'],'scope',lang)),'STRATEGY_PRICE':price(PRICING['strategy']['price'],lang)}
def common(lang='hr'):
    v={k.upper():esc(str(value)) for k,value in SITE.items() if isinstance(value,str)}
    v.update(LEGAL_NAME=esc(SITE['business_legal_name']),PHONE_DISPLAY=esc(SITE['phone_display']),PORTRAIT=photo(lang),OWNER_CARD=owner_card(lang),JOURNEY=partial('journey-hr.html'),PROJECT_VISUAL=partial('project-visual.html'),HOME_FAQ=faq_html(FAQ),REVIEWS='')
    # Empty reviews never produce a public block or rating markup.
    if REVIEWS:
        v['REVIEWS']='<section class="section container" aria-labelledby="reviews-title"><h2 id="reviews-title">'+('Iskustva suradnje' if lang=='hr' else 'Client feedback')+'</h2>'+''.join('<figure class="review"><blockquote>'+esc(x['text'])+'</blockquote><figcaption>'+esc(x['name'])+' · '+esc(x['date'])+' · '+esc(x['source'])+'</figcaption></figure>' for x in REVIEWS)+'</section>'
    v['CONTACT_FORM']=render(partial('contact-form-hr.html'),v)
    if (T/'partials/analysis-form.html').exists():
        base=partial('analysis-form.html')
        name='<div class="field"><label for="analysis-name">Ime (neobavezno)</label><input id="analysis-name" name="name" autocomplete="name" maxlength="100"></div>'
        v['ANALYSIS_FORM']=render(base,dict(v,OPTIONAL_NAME=name))
        v['COMPACT_ANALYSIS_FORM']=render(base,dict(v,OPTIONAL_NAME=''))
    v.update(prices(lang));return v

def schema(path,lang='hr',kind=None,data=None):
    return ''

def document(body,title,description,path,lang='hr',pair=None,kind=None,data=None):
    values=common(lang)
    links=''
    if pair:
        hr,en=(path,pair) if lang=='hr' else (pair,path)
        links=f'<link rel="alternate" hreflang="hr" href="{DOMAIN+hr}"><link rel="alternate" hreflang="en" href="{DOMAIN+en}"><link rel="alternate" hreflang="x-default" href="{DOMAIN}/">'
    language_links='<a href="'+(path if lang=='hr' else pair or '/')+'" lang="hr"'+(' aria-current="page"' if lang=='hr' else '')+'>HR</a><span aria-hidden="true">|</span><a href="'+(path if lang=='en' else pair or '/en/')+'" lang="en"'+(' aria-current="page"' if lang=='en' else '')+'>EN</a>'
    values['LANGUAGE_LINKS']=language_links
    preload=''.join(f'<link rel="preload" href="{asset("/fonts/"+f+".woff")}" as="font" type="font/woff" crossorigin>' for f in ['dm-sans-regular','dm-sans-bold','pixelify-sans-medium'])
    values.update(LANG=lang,TITLE=esc(title),DESCRIPTION=esc(description),CANONICAL=DOMAIN+path,HREFLANG=links,LOCALE='hr_HR' if lang=='hr' else 'en_GB',SKIP='Preskočite na sadržaj' if lang=='hr' else 'Skip to content',SYMBOLS=partial('symbols.html'),PRELOADS=preload,CSS_URL=asset('/css/style.css'),LOCAL_CSS_URL=asset('/css/local.css'),MAIN_JS_URL=asset('/js/main.js'),MOTION_JS_URL=asset('/js/motion.js'),BODY=render(body,values),HEADER=render(partial(f'header-{lang}.html'),values),FOOTER=render(partial(f'footer-{lang}.html'),values),SCHEMA=schema(path,lang,kind,data))
    return render((T/'layout.html').read_text(),values)
def output(path,html): OUTPUTS[path.lstrip('/')+'index.html' if path.endswith('/') else path.lstrip('/')]=html

def english(name,path,pair):
    s=(T/'en'/name).read_text()
    title=re.search(r'<title>(.*?)</title>',s,re.S).group(1)
    desc=re.search(r'<meta\s+name="description"\s+content="(.*?)"',s,re.S).group(1)
    body=re.search(r'<main\b.*?</main>',s,re.S).group()
    body=body.replace('href="/privacy/"','href="/en/privacy/"').replace('href="/cookies/"','href="/en/cookies/"').replace('href="/#','href="/en/#').replace('href="/"','href="/en/"').replace('info.nimbusit@gmail.com','{{EMAIL}}')
    body=re.sub(r'<span class="person-icon".*?</span>',lambda m:'<span class="person-initials pixel" aria-hidden="true">AL</span>',body,flags=re.S)
    return document(body,title,desc,path,'en',pair)

output('/',document((T/'index.html').read_text(),'Izrada web stranica i Google oglasi za obrte | NimbusIT','Web stranice, Google i Meta oglasi i obrasci koji Vam pošalju sve podatke za ponudu. Za obrte u Hrvatskoj i EU. Besplatna analiza Vaše stranice.','/',pair='/en/',kind='home'))
output('/en/',english('index.html','/en/','/'))
for slug,title in [('privacy','Privatnost'),('cookies','Kolačići')]:
    hr='/privatnost/' if slug=='privacy' else '/kolacici/'
    output(hr,document((T/f'{slug}-hr.html').read_text(),title+' | NimbusIT',title+' i obrada podataka na stranici NimbusIT.',hr,pair='/en/'+slug+'/'))
    output('/en/'+slug+'/',english(slug+'.html','/en/'+slug+'/',hr))
    old='/'+slug+'/'
    dest='/en/'+slug+'/'
    output(old,'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page moved — NimbusIT</title><meta name="robots" content="noindex"><link rel="canonical" href="'+DOMAIN+dest+'"><meta http-equiv="refresh" content="0;url='+dest+'"></head><body><h1>This page has moved.</h1><a href="'+dest+'">Continue to the English page</a></body></html>')
output('/404.html',document((T/'404.html').read_text(),'Stranica nije pronađena | NimbusIT','Tražena stranica nije pronađena.','/404.html'))
# Additional page modules are rendered from the same shell.
if (T/'analysis.html').exists():
    output('/besplatna-analiza/',document((T/'analysis.html').read_text(),'Besplatna analiza web stranice | NimbusIT','Pošaljite adresu stranice i dogovorite 15 minuta razgovora. Dobivate PDF s 5 konkretnih popravaka, bez obveze.','/besplatna-analiza/',kind='analysis'))
if (ROOT/'data/services.json').exists():
    for service in json.loads((ROOT/'data/services.json').read_text()):
        group,index=service['price_source'].split(':')
        amount=PRICING[group][int(index)]['price']
        service['resolved_price']=amount
        service['faq']=[{k:v.replace('{PRICE}',price(amount)) for k,v in q.items()} for q in service['faq']]
        values={k.upper():esc(str(v)) for k,v in service.items() if isinstance(v,str)}
        values.update(PRICE=price(amount),INTRO=esc(service['intro'].replace('{PRICE}',price(amount))),BREADCRUMB_NAME={'web':'Izrada web stranica','ads':'Google i Meta oglasi','configurator':'Konfigurator proizvoda'}[service['id']],DELIVERABLES=''.join('<li>'+esc(x)+'</li>' for x in service['deliverables']),PROCESS=''.join('<li>'+esc(x)+'</li>' for x in service['process']),SERVICE_FAQ=faq_html(service['faq']))
        output(service['path'],document(render((T/'service.html').read_text(),values),service['title'],service['description'].replace('1.900 €',price(PRICING['packages'][0]['price'])).replace('5.900 €',price(PRICING['packages'][2]['price'])),service['path'],kind='service',data=service))

urls=[p for p in OUTPUTS if p!='404.html' and not p.startswith(('privacy/','cookies/'))]
OUTPUTS['sitemap.xml']='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join(f'  <url><loc>{DOMAIN}/{"" if p=="index.html" else p.removesuffix("index.html")}</loc><lastmod>{SITE["updated"]}</lastmod></url>\n' for p in urls)+'</urlset>\n'
allowed={'{{ADRESA_OBRTA}}','{{OIB}}','{{PDV_NAPOMENA}}'}
for path,text in OUTPUTS.items():
    unknown=set(re.findall(r'\{\{.*?\}\}',text))-allowed
    assert not unknown,(path,unknown)
    text=text.rstrip('\n')+'\n'
    target=ROOT/path
    if '--check' in sys.argv:
        assert target.exists() and target.read_text()==text,path+' is stale; run scripts/build.py'
    else:
        target.parent.mkdir(parents=True,exist_ok=True);target.write_text(text+'\n' if not text.endswith('\n') else text)
        OUTPUTS[path]=target.read_text()
# --check compares a normalised trailing newline.
print(('Checked' if '--check' in sys.argv else 'Built')+f' {len(OUTPUTS)} static outputs from templates and data.')
