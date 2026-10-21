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
# Render hashed font references from the CSS source, without a bundler.
def font_url(match):
    path=match.group(1)
    digest=hashlib.sha256((ROOT/path.lstrip('/')).read_bytes()).hexdigest()[:12]
    return 'url("'+path+'?v='+digest+'")'
css=re.sub(r'url\("(/fonts/[^"?]+\.woff2?)"\)',font_url,(T/'style.css').read_text())
if '--check' in sys.argv:
    assert (ROOT/'css/style.css').read_text()==css,'Generated CSS is stale'
else:
    (ROOT/'css/style.css').write_text(css)

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
    if path.is_file():
        if (ROOT/'img/antonio-240.webp').is_file() and (ROOT/'img/antonio-480.webp').is_file():
            return '<figure class="portrait"><img src="/img/antonio-240.webp" srcset="/img/antonio-240.webp 240w, /img/antonio-480.webp 480w" sizes="(min-width:600px) 320px, 64px" alt="Antonio Lovrić, NimbusIT" width="480" height="480" loading="lazy"></figure>'
        return f'<figure class="portrait"><img src="{esc(src)}" alt="Antonio Lovrić, NimbusIT" width="400" height="400" loading="lazy"></figure>'
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
    areas=[{'@type':'Country' if name=='Hrvatska' else 'AdministrativeArea','name':name} for name in SITE['area_served']]
    provider=DOMAIN+'/#poslovanje'
    graph=[]
    if path in ['/', '/en/']:
        business={'@type':'ProfessionalService','@id':provider,'name':'NimbusIT','legalName':SITE['business_legal_name'],'url':DOMAIN+'/','address':{'@type':'PostalAddress','streetAddress':SITE['address'],'addressLocality':SITE['primary_city'],'addressCountry':'HR'},'telephone':SITE['phone_e164'],'email':SITE['email'],'areaServed':areas,'priceRange':'€€','founder':{'@type':'Person','name':SITE['owner']},'image':DOMAIN+(SITE['photo'] if (ROOT/SITE['photo'].lstrip('/')).is_file() else '/img/nimbusit-og.png')}
        ratings=[x.get('rating') for x in REVIEWS]
        if ratings and all(isinstance(x,(int,float)) and 1<=x<=5 for x in ratings):
            business['aggregateRating']={'@type':'AggregateRating','ratingValue':round(sum(ratings)/len(ratings),2),'reviewCount':len(ratings),'bestRating':5,'worstRating':1}
        graph += [business,{'@type':'WebSite','@id':DOMAIN+path+'#website','url':DOMAIN+path,'name':'NimbusIT','inLanguage':lang}]
    questions=FAQ if kind=='home' else data['faq'] if kind=='service' else []
    if questions: graph.append({'@type':'FAQPage','@id':DOMAIN+path+'#faq-data','mainEntity':[{'@type':'Question','name':q['q'],'acceptedAnswer':{'@type':'Answer','text':q['a']}} for q in questions]})
    if kind=='service':
        offer={'@type':'Offer','price':data['resolved_price'],'priceCurrency':'EUR','url':DOMAIN+path}
        if data['price_source'].startswith('monthly'):
            offer['priceSpecification']={'@type':'UnitPriceSpecification','price':data['resolved_price'],'priceCurrency':'EUR','unitText':'mjesečno'}
        graph += [{'@type':'Service','@id':DOMAIN+path+'#service','name':data['h1'],'url':DOMAIN+path,'provider':{'@id':provider},'areaServed':areas,'offers':offer},{'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Naslovnica','item':DOMAIN+'/'},{'@type':'ListItem','position':2,'name':'Usluge','item':DOMAIN+'/#usluge'},{'@type':'ListItem','position':3,'name':data['h1'],'item':DOMAIN+path}]}]
    return '<script type="application/ld+json">'+json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False).replace('<','\\u003c')+'</script>' if graph else ''


def document(body,title,description,path,lang='hr',pair=None,kind=None,data=None):
    values=common(lang)
    links=''
    if pair:
        hr,en=(path,pair) if lang=='hr' else (pair,path)
        links=f'<link rel="alternate" hreflang="hr" href="{DOMAIN+hr}"><link rel="alternate" hreflang="en" href="{DOMAIN+en}"><link rel="alternate" hreflang="x-default" href="{DOMAIN}/">'
    language_links='<a href="'+(path if lang=='hr' else pair or '/')+'" lang="hr"'+(' aria-current="page"' if lang=='hr' else '')+'>HR</a><span aria-hidden="true">|</span><a href="'+(path if lang=='en' else pair or '/en/')+'" lang="en"'+(' aria-current="page"' if lang=='en' else '')+'>EN</a>'
    values['LANGUAGE_LINKS']=language_links
    preload=''.join(f'<link rel="preload" href="{asset("/fonts/"+f+".woff2")}" as="font" type="font/woff2" crossorigin>' for f in ['dm-sans-regular','dm-sans-bold','pixelify-sans-medium'])
    values.update(LANG=lang,TITLE=esc(title),DESCRIPTION=esc(description),CANONICAL=DOMAIN+path,HREFLANG=links,LOCALE='hr_HR' if lang=='hr' else 'en_GB',SKIP='Preskočite na sadržaj' if lang=='hr' else 'Skip to content',SYMBOLS=partial('symbols.html'),PRELOADS=preload,CSS_URL=asset('/css/style.css'),LOCAL_CSS_URL=asset('/css/local.css'),MAIN_JS_URL=asset('/js/main.js'),MOTION_JS_URL=asset('/js/motion.js'),BODY=render(body,values),HEADER=render(partial(f'header-{lang}.html'),values),FOOTER=render(partial(f'footer-{lang}.html'),values),SCHEMA=schema(path,lang,kind,data))
    return render((T/'layout.html').read_text(),values)
def output(path,html):
    html=html.replace('src="/img/pergola-sunbreaker-400.webp"','src="/img/pergola-sunbreaker-600.webp" srcset="/img/pergola-sunbreaker-600.webp 600w, /img/pergola-sunbreaker-400.webp 1100w" sizes="(min-width:1101px) 650px, (min-width:801px) 50vw, calc(100vw - 40px)"')
    OUTPUTS[path.lstrip('/')+'index.html' if path.endswith('/') else path.lstrip('/')]=html

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
