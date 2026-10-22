#!/usr/bin/env python3
"""Build NimbusIT's original flat SVG illustrations. No third-party artwork."""

from pathlib import Path

PARTIALS = Path(__file__).resolve().parent.parent / "templates/partials"


def svg(name, viewbox, body, cls):
    aspect = ' preserveAspectRatio="xMidYMax slice"' if cls == "world-road" else ""
    (PARTIALS / name).write_text(
        f'<svg class="{cls}" viewBox="{viewbox}"{aspect} fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">\n{body}\n</svg>\n'
    )


symbols = """
<symbol id="n-cloud" viewBox="0 0 240 110"><path d="M26 90C0 90 0 56 26 51C22 22 62 12 78 32C89-3 142-7 155 28C179 11 211 27 208 52C247 48 251 95 216 96L29 96Z" fill="currentColor"/><path d="M32 92H213" stroke="#e0f5fb" stroke-width="9" stroke-linecap="round"/></symbol>
<symbol id="n-tree" viewBox="0 0 72 140"><path d="M36 73V140" stroke="#9b7157" stroke-width="9"/><ellipse cx="36" cy="53" rx="32" ry="49" fill="currentColor"/><ellipse cx="25" cy="40" rx="11" ry="22" fill="#fff" opacity=".15"/></symbol>
<symbol id="n-building" viewBox="0 0 120 250"><rect x="4" y="3" width="112" height="247" rx="5" fill="currentColor"/><path d="M21 30H48M72 30H99M21 66H48M72 66H99M21 102H48M72 102H99M21 138H48M72 138H99M21 174H48M72 174H99" stroke="#e3f5f3" stroke-width="16"/><path d="M47 250V211H73V250" fill="#43616d"/></symbol>
<symbol id="n-house" viewBox="0 0 170 165"><path d="M17 72H153V165H17Z" fill="#fff5d8"/><path d="M0 77L85 2L170 77Z" fill="currentColor"/><path d="M36 94H66V124H36ZM104 94H134V124H104Z" fill="#acdbe3"/><path d="M76 165V119H99V165" fill="#825a4b"/><path d="M129 32V4H144V45" fill="#547a79"/></symbol>
<symbol id="n-shop" viewBox="0 0 300 240"><rect x="20" y="30" width="260" height="210" rx="8" fill="#fff9e9"/><rect x="34" y="52" width="232" height="40" rx="6" fill="#2c8f81"/><path d="M140 62L155 54L170 62V81H140Z" fill="#c3ece0"/><path d="M6 109H294L280 147H20Z" fill="#f5bd61"/><path d="M48 109L44 147M96 109L94 147M144 109V147M192 109L194 147M240 109L244 147" stroke="#fff5d8" stroke-width="22"/><rect x="39" y="162" width="130" height="58" rx="3" fill="#a8dfe7"/><path d="M83 162V220M126 162V220" stroke="#fff" stroke-width="5"/><rect x="195" y="161" width="48" height="79" rx="3" fill="#477380"/><circle cx="232" cy="201" r="3" fill="#f5bd61"/></symbol>
<symbol id="n-car" viewBox="0 0 180 80"><path d="M14 37L37 8H110L143 37H164C174 37 180 45 180 55V66H0V51C0 44 4 38 14 37Z" fill="currentColor"/><path d="M45 15L27 37H75V15ZM83 15V37H128L104 15Z" fill="#d4f1f3"/><circle cx="37" cy="64" r="16" fill="#303443"/><circle cx="143" cy="64" r="16" fill="#303443"/><circle cx="37" cy="64" r="7" fill="#d5e0e2"/><circle cx="143" cy="64" r="7" fill="#d5e0e2"/><path d="M162 47H177" stroke="#fff3c7" stroke-width="9"/></symbol>
<symbol id="n-person" viewBox="0 0 46 100"><path d="M17 62L12 96M28 62L35 96" stroke="#303e5d" stroke-width="9" stroke-linecap="round"/><path d="M13 36H34L38 68H8Z" fill="currentColor"/><path d="M12 41L2 61M34 41L44 58" stroke="#f0be9d" stroke-width="7" stroke-linecap="round"/><circle cx="23" cy="19" r="13" fill="#f0be9d"/><path d="M10 19C6-2 37-3 37 17L26 10Z" fill="#303443"/></symbol>
<symbol id="n-envelope" viewBox="0 0 160 110"><rect x="3" y="3" width="154" height="104" rx="12" fill="#fffdf7"/><path d="M7 11L80 64L153 11M7 101L55 62M153 101L105 62" stroke="#89cfc7" stroke-width="6" stroke-linecap="round"/></symbol>
<symbol id="n-arrow" viewBox="0 0 40 40"><path d="M8 20H31M21 9L32 20L21 31" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="n-pointer" viewBox="0 0 65 80"><path d="M5 4L58 43L34 46L23 72Z" fill="#303443" stroke="#fff" stroke-width="5" stroke-linejoin="round"/></symbol>
"""
svg("world-symbols.html", "0 0 1 1", "<defs>" + symbols + "</defs>", "svg-library")

buildings = "".join(
    f'<use href="#n-building" x="{x}" y="{y}" width="{w}" height="{h}" color="{color}"/>'
    for x, y, w, h, color in [
        (65, 260, 100, 240, "#b9dfe6"), (230, 300, 90, 200, "#c5e8ec"),
        (372, 340, 110, 170, "#a8d6e2"), (1125, 285, 110, 220, "#b4dce5"),
        (1260, 325, 90, 180, "#c6e8e9"), (1390, 250, 110, 255, "#b0dae5"),
    ]
)
trees = "".join(
    f'<use href="#n-tree" x="{x}" y="{y}" width="{w}" height="{h}" color="{c}"/>'
    for x, y, w, h, c in [(290,420,55,100,"#359e73"),(360,440,40,75,"#65bd7e"),(1110,416,50,100,"#54af72"),(1220,435,50,90,"#359e73"),(1330,415,55,110,"#69bd81")]
)
hero = f"""
<g class="hero-scene__back">{buildings}<path d="M0 514Q320 458 790 506Q1250 453 1600 512V620H0Z" fill="#68b982"/><path d="M0 551Q410 489 900 543Q1310 485 1600 548V620H0Z" fill="#3f9e74"/>{trees}</g>
<g class="hero-board-wrap"><g class="hero-board" transform="rotate(-7 800 320)">
<rect x="419" y="99" width="742" height="390" rx="22" fill="#656fbc"/><rect x="419" y="99" width="742" height="46" rx="22" fill="#858ed8"/><path d="M419 125H1161V148H419Z" fill="#858ed8"/>
<circle cx="449" cy="123" r="7" fill="#f9cf92"/><circle cx="472" cy="123" r="7" fill="#c3e9dc"/><circle cx="495" cy="123" r="7" fill="#fff7e4"/>
<rect x="446" y="171" width="688" height="291" rx="12" fill="#f8f7ed"/><rect x="474" y="195" width="150" height="12" rx="6" fill="#303443"/><rect x="934" y="191" width="166" height="25" rx="12" fill="#d98a66"/>
<rect x="473" y="242" width="339" height="189" rx="10" fill="#c5e7e2"/><path d="M497 367H790M511 368V286L645 254L778 286V368M512 286L645 318L777 286M645 318V405M512 295L645 328L777 295M533 280L666 312M558 274L691 306M583 268L716 300M608 262L741 294" stroke="#3b766f" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M843 254H1063M843 279H1027M843 326H1078M843 351H1027" stroke="#a4b2c2" stroke-width="11" stroke-linecap="round"/>
<rect x="838" y="384" width="252" height="40" rx="20" fill="#279781"/><path d="M1004 403H1064M1051 392L1064 403L1051 414" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
</g></g>
<g transform="translate(46 151)"><g class="hero-person hero-person--left">
<path d="M21 477L29 285L172 265L211 477Z" fill="#345d83"/><path d="M51 320L49 477M141 320L164 477" stroke="#2e354b" stroke-width="44"/>
<path d="M38 476H83M145 476H194" stroke="#252f43" stroke-width="19" stroke-linecap="round"/>
<path d="M60 192C3 211-4 280 5 371L170 374L198 216L143 191Z" fill="#2d9c8a"/><path d="M98 192V374" stroke="#57b5a4" stroke-width="7"/>
<path d="M71 184V216Q104 249 129 216V170" fill="#e8ab89"/>
<path d="M142 217Q163 267 231 290L257 256" stroke="#303e68" stroke-width="42" stroke-linecap="round"/><path d="M22 224Q-14 293 36 327L106 344" stroke="#303e68" stroke-width="39" stroke-linecap="round"/>
<rect x="73" y="297" width="202" height="28" rx="10" transform="rotate(8 73 297)" fill="#303e68"/><rect x="94" y="213" width="181" height="104" rx="9" transform="rotate(8 94 213)" fill="#e7edf0"/>
<path d="M169 253C156 249 153 269 165 273H198C213 269 207 251 196 252C193 235 172 236 169 253Z" fill="#48a491"/>
<circle cx="245" cy="290" r="24" fill="#f2c4a4"/><circle cx="87" cy="330" r="22" fill="#f2c4a4"/>
<path d="M46 92C35 29 146 1 166 85L160 148L55 149Z" fill="#303e68"/><path d="M52 84C71 29 158 49 161 102V145C149 204 71 202 52 153Z" fill="#f2c4a4"/>
<circle cx="47" cy="127" r="16" fill="#edb493"/><path d="M46 84Q101 99 145 59Q110 5 63 45Z" fill="#303e68"/>
<circle cx="132" cy="124" r="5" fill="#303443"/><path d="M124 109Q132 102 139 110M136 154Q145 162 153 152" stroke="#303443" stroke-width="5" stroke-linecap="round"/><circle cx="120" cy="145" r="10" fill="#eaa291"/>
</g></g>
<g transform="translate(1306 144)"><g class="hero-person hero-person--right">
<path d="M41 280L27 477H198L178 279Z" fill="#575f9b"/><path d="M78 331L68 477M142 333L164 477" stroke="#303e68" stroke-width="42"/>
<path d="M42 476H90M147 476H192" stroke="#29354a" stroke-width="18" stroke-linecap="round"/>
<path d="M25 214Q78 174 162 200L205 365H17Z" fill="#dc9368"/><path d="M84 188V217Q110 237 133 211V176" fill="#e2a27d"/>
<path d="M21 232Q-9 272 30 333L86 313M169 226Q217 260 164 326" stroke="#303e68" stroke-width="36" stroke-linecap="round"/>
<g transform="rotate(-9 102 298)"><rect x="22" y="252" width="147" height="135" rx="12" fill="#e3c49b"/><rect x="34" y="263" width="123" height="109" rx="5" fill="#fffdf4"/><path d="M59 288H133M59 316H133M59 344H119" stroke="#b1bdc7" stroke-width="7" stroke-linecap="round"/><path d="M43 285L47 290L54 280M43 313L47 318L54 308M43 341L47 346L54 336" stroke="#42a991" stroke-width="4" stroke-linecap="round"/></g>
<circle cx="27" cy="328" r="19" fill="#f0c0a0"/><circle cx="158" cy="333" r="19" fill="#f0c0a0"/>
<path d="M38 98Q25 3 112 24Q184 20 173 115L199 233Q157 264 137 201L113 143Z" fill="#303e68"/>
<path d="M43 81C66 35 147 48 155 97V149C142 203 68 204 47 154Z" fill="#f2c4a4"/><circle cx="154" cy="123" r="15" fill="#eab08e"/>
<path d="M39 84Q101 89 123 51Q64 16 43 62Z" fill="#303e68"/><circle cx="71" cy="123" r="5" fill="#303443"/><path d="M64 108Q72 101 79 109M49 153Q57 162 69 154" stroke="#303443" stroke-width="5" stroke-linecap="round"/><circle cx="85" cy="145" r="10" fill="#eaa291"/>
</g></g>
<g class="hero-message"><use href="#n-envelope" x="1123" y="84" width="126" height="85"/><circle cx="1233" cy="89" r="21" fill="#2b9c83"/><path d="M1224 89L1230 95L1242 82" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g>
<use class="hero-pointer" href="#n-pointer" x="1092" y="413" width="48" height="61"/>
"""
svg("world-hero.html", "0 0 1600 640", hero, "world-hero")

city = '<path d="M0 140Q400 37 800 130Q1210 70 1600 137V580H0Z" fill="#a7d8d8"/>'
for x,y,w,h,col in [(25,100,95,200,"#95bdcc"),(152,170,85,150,"#d4c49d"),(260,74,100,240,"#9cc6d5"),(386,150,120,180,"#bbc8cb"),(540,104,90,220,"#d4b29f"),(1048,96,115,228,"#9db3ca"),(1210,150,92,180,"#c1c9ab"),(1352,90,100,240,"#9fc9d2"),(1483,172,100,153,"#d8b6a0")]:
    city += f'<use href="#n-building" x="{x}" y="{y}" width="{w}" height="{h}" color="{col}"/>'
city += '<path d="M0 326Q400 268 800 327Q1230 280 1600 323V580H0Z" fill="#71bc85"/><path d="M0 428Q600 354 1600 416V580H0Z" fill="#52aa7c"/>'
city += '<path d="M0 464H1600V525H0Z" fill="#869fa8"/><path d="M0 461H1600M0 528H1600" stroke="#d6e7da" stroke-width="7"/><path d="M0 496H1600" stroke="#fff9e8" stroke-width="5" stroke-dasharray="46 40"/>'
city += '<path d="M835 362L1020 580" stroke="#f4e8c8" stroke-width="41"/>'
city += '<use href="#n-shop" x="646" y="165" width="300" height="240"/>'
for x,y,w,h,col in [(222,257,160,154,"#c87764"),(1100,263,150,146,"#e1aa59"),(1320,296,130,121,"#666da3")]:
    city += f'<use href="#n-house" x="{x}" y="{y}" width="{w}" height="{h}" color="{col}"/>'
for x,y,h,col in [(22,290,145,"#2c8f71"),(136,338,95,"#37966c"),(409,293,130,"#338f6e"),(558,344,90,"#3d9f72"),(982,307,120,"#2c8f71"),(1240,330,100,"#3b9770"),(1460,293,140,"#2c8f71"),(1531,335,98,"#3b9770")]:
    city += f'<use href="#n-tree" x="{x}" y="{y}" width="{h//2}" height="{h}" color="{col}"/>'
for x,y,col in [(522,331,"#e4ad58"),(1025,340,"#e78d75"),(939,494,"#747bb1"),(1167,510,"#f0bb57")]:
    city += f'<use href="#n-person" x="{x}" y="{y}" width="28" height="65" color="{col}"/>'
city += '<g class="city-car city-car--one"><use href="#n-car" x="240" y="459" width="109" height="48" color="#e7ac55"/></g><g class="city-car city-car--two"><use href="#n-car" x="1100" y="467" width="109" height="48" color="#e58571"/></g>'
svg("world-city.html", "0 0 1600 580", city, "world-city")

web = """<rect x="52" y="74" width="356" height="244" rx="20" fill="#fffdf6"/><rect x="52" y="74" width="356" height="40" rx="20" fill="#dbe6de"/><path d="M52 96H408V114H52Z" fill="#dbe6de"/><circle cx="76" cy="94" r="5" fill="#d58468"/><circle cx="95" cy="94" r="5" fill="#e8b65a"/><circle cx="114" cy="94" r="5" fill="#579986"/><path d="M79 142H225M79 164H193" stroke="#344455" stroke-width="11" stroke-linecap="round"/><rect x="78" y="192" width="130" height="93" rx="9" fill="#b4ded0"/><path d="M99 265V228L143 207L187 228V265M99 228L143 247L187 228M143 247V278" stroke="#398878" stroke-width="6" stroke-linejoin="round"/><path d="M234 199H372M234 222H349M234 246H367" stroke="#a5bac0" stroke-width="9" stroke-linecap="round"/><rect x="233" y="269" width="111" height="21" rx="10" fill="#d28d64"/><use href="#n-pointer" x="339" y="283" width="46" height="60"/><path d="M172 336H287" stroke="#41606c" stroke-width="13" stroke-linecap="round"/><path d="M220 318V334" stroke="#41606c" stroke-width="16"/>"""
ads = """<circle cx="237" cy="204" r="128" fill="#e8e4f3"/><path d="M145 143L332 88V280L145 226Z" fill="#fffdf8"/><path d="M332 89V280" stroke="#555e99" stroke-width="18" stroke-linecap="round"/><path d="M138 149H171V225H138C104 225 104 149 138 149Z" fill="#e3ad59"/><path d="M166 225L178 298H215L199 239" fill="#555e99"/><path d="M358 116L389 101M365 180H406M356 245L389 262" stroke="#c57c60" stroke-width="9" stroke-linecap="round"/><circle cx="106" cy="289" r="41" fill="#fffdf8"/><path d="M81 286H128M116 275L128 286L116 297" stroke="#2c8f7f" stroke-width="7" stroke-linecap="round"/>"""
config = """<rect x="74" y="46" width="310" height="310" rx="20" transform="rotate(-6 229 201)" fill="#fffdf7"/><path d="M119 107H280M119 133H235" stroke="#36434f" stroke-width="12" stroke-linecap="round"/><path d="M119 190H337M119 245H337M119 300H337" stroke="#bdced3" stroke-width="9" stroke-linecap="round"/><circle cx="182" cy="190" r="14" fill="#2e9680"/><circle cx="283" cy="245" r="14" fill="#e0ac55"/><circle cx="223" cy="300" r="14" fill="#626aa4"/><circle cx="366" cy="317" r="43" fill="#2e9680"/><path d="M345 316L360 331L387 302" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>"""
crm = """<path d="M98 174H353M227 174V287" stroke="#bd9d8a" stroke-width="7" stroke-dasharray="10 10"/><rect x="68" y="83" width="142" height="96" rx="15" fill="#fffaf4"/><use href="#n-envelope" x="91" y="104" width="95" height="53"/><rect x="276" y="83" width="113" height="96" rx="15" fill="#fffaf4"/><circle cx="332" cy="118" r="17" fill="#849db5"/><path d="M305 159Q305 136 332 136Q359 136 359 159" fill="#849db5"/><rect x="153" y="261" width="154" height="79" rx="15" fill="#fffaf4"/><circle cx="190" cy="301" r="17" fill="#2c9380"/><path d="M181 301L187 307L199 294" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M224 291H277M224 310H265" stroke="#aeb9c3" stroke-width="7" stroke-linecap="round"/><circle class="connection-dot" cx="227" cy="174" r="13" fill="#626ba7"/>"""
for name, body in [("web",web),("ads",ads),("config",config),("crm",crm)]:
    svg("art-" + name + ".html", "0 0 460 400", body, "service-art")

svg("world-road.html", "0 0 1600 160", '<path d="M0 25Q700-15 1600 29V160H0Z" fill="#62b77b"/><path d="M0 80H1600V131H0Z" fill="#8babb2"/><path d="M0 78H1600M0 133H1600" stroke="#d5e8db" stroke-width="6"/><path d="M0 106H1600" stroke="#fffdf3" stroke-width="4" stroke-dasharray="43 42"/><g class="road-car"><use href="#n-car" x="270" y="75" width="114" height="51" color="#e8af5c"/></g><use href="#n-tree" x="1390" y="0" width="44" height="90" color="#358e6c"/>', "world-road")
print("Built 8 original SVG illustration partials.")
