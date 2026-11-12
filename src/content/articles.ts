import type { ArticleContent } from "./types";

/**
 * Articles d'origine de la page Astuces & Conseils (modifiables dans le dashboard).
 * Les faits médicaux viennent des sources citées en bas de chaque article ;
 * les soins Cure's Nappy sont proposés comme routine, pas comme traitement médical.
 */

const AAD_BLACK_HAIR = { title: "Black hair: Tips for everyday care — American Academy of Dermatology", url: "https://www.aad.org/public/everyday-care/hair-scalp-care/hair/care-african-american" };
const AAD_STYLING = { title: "Hair styling without damage — American Academy of Dermatology", url: "https://www.aad.org/public/diseases/hair-loss/hair-care/styling" };
const AAD_STOP_DAMAGE = { title: "How to stop damaging your hair — American Academy of Dermatology", url: "https://www.aad.org/public/skin-hair-nails/hair-care/how-to-stop-hair-damage" };
const AAD_HEALTHY = { title: "Tips for healthy hair — American Academy of Dermatology", url: "https://www.aad.org/public/everyday-care/hair-scalp-care/hair/healthy-hair-tips" };
const JHU_TRACTION = { title: "Risky hairstyles and traction alopecia (revue de Johns Hopkins, Journal of the American Academy of Dermatology, 2016)", url: "https://hub.jhu.edu/2016/05/05/risky-hairstyles-traction-alopecia" };
const KOYAMA = { title: "Koyama et al. — Standardized scalp massage results in increased hair thickness (Eplasty, 2016)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4740347" };

export const defaultTips: ArticleContent[] = [
  {
    id: "stimuler-la-pousse",
    icon: "sparkles",
    title: "Stimuler la pousse des cheveux crépus : le guide complet",
    intro: "Vos cheveux poussent, mais la longueur ne suit pas ? Le vrai sujet est souvent la casse, pas la pousse. Voici comment garder chaque centimètre gagné.",
    image: "asset:slide-4",
    body: `« Mes cheveux ne poussent pas » est la phrase que l'on entend le plus. Pourtant, chez la très grande majorité des personnes, le cuir chevelu fabrique du cheveu tous les jours. Ce qui manque, c'est la **rétention** : les pointes se cassent au même rythme que les racines avancent, et la longueur semble bloquée.

> Le bon objectif n'est pas seulement « faire pousser », c'est « garder ce qui pousse ». Un cheveu crépu en bonne santé, qui ne casse pas, finit toujours par gagner en longueur.

## Pourquoi les cheveux crépus cassent plus facilement

Un cheveu crépu forme des boucles très serrées. À chaque courbe, la fibre est plus fine et plus fragile. Le sébum, l'huile naturelle produite par le cuir chevelu, a aussi du mal à descendre le long de ces spirales : les longueurs et surtout les pointes sont naturellement plus sèches. L'Académie américaine de dermatologie rappelle que ce type de cheveu est très sec et a besoin de soins qui apportent et gardent l'hydratation.

Un cheveu sec devient rigide, s'emmêle et se casse au démêlage, au coiffage ou simplement par frottement contre l'oreiller. C'est pour cela qu'une routine de pousse est d'abord une routine d'hydratation et de douceur.

## Les trois signes que votre problème est la casse

- Vous retrouvez des **petits bouts de cheveux** (sans bulbe blanc au bout) sur vos épaules, dans le lavabo ou sur le peigne.
- Vos pointes sont **fines, sèches, effilées**, parfois avec des nœuds.
- Votre longueur **n'a pas bougé depuis des mois** alors que vos racines repoussent bien.

Si au contraire vous perdez des cheveux entiers (avec le petit bulbe blanc), en grande quantité, ou si vous voyez des zones dégarnies, lisez notre article sur [la chute des cheveux](/conseils/chute-des-cheveux) : ce n'est plus de la casse et il faut en chercher la cause.

## Le massage du cuir chevelu : ce que l'on sait vraiment

Le massage est l'un des gestes les plus recommandés, et il existe au moins une étude pour l'appuyer. En 2016, des chercheurs japonais ont fait masser le cuir chevelu de neuf hommes 4 minutes par jour pendant 24 semaines : leurs cheveux étaient en moyenne plus épais à la fin de l'étude. C'est une petite étude, sur peu de personnes, qui ne prouve pas que le massage fait « pousser » plus vite. Mais c'est un geste sans risque, agréable, qui détend et qui aide à bien répartir les soins sur le cuir chevelu.

**Comment masser :**
1. Déposez quelques gouttes d'huile sur les raies, directement sur le cuir chevelu.
2. Avec la pulpe des doigts (jamais les ongles), faites de petits cercles en appuyant légèrement, de la nuque vers le front.
3. Massez 4 à 5 minutes, 3 à 4 fois par semaine. La régularité compte plus que la durée.

> Ne frottez pas : le massage se fait avec la pulpe des doigts, sans tirer sur les cheveux ni gratter le cuir chevelu.

## Les 7 règles d'or pour garder la longueur

1. **Hydrater, puis sceller.** Appliquez un soin hydratant (à base d'eau) sur cheveux humides, puis une crème et une huile pour garder cette eau dans la fibre. Notre article sur [la méthode LOC](/conseils/hydratation-longue-duree) explique pas à pas.
2. **Démêler mouillé, avec du produit, et en commençant par les pointes.** Jamais sur cheveux secs, jamais de la racine vers les pointes.
3. **Limiter la chaleur.** Le fer et le séchoir abîment la fibre. L'Académie américaine de dermatologie conseille d'utiliser le fer au plus une fois par semaine, à la température la plus basse possible, après un protecteur de chaleur.
4. **Choisir des coiffures protectrices… sans tension.** Une coiffure qui fait mal tire sur les racines. Si une tresse vous fait souffrir, demandez qu'on la refasse plus lâche.
5. **Ne pas garder une coiffure trop longtemps.** Les tresses ne devraient pas rester plus de deux à trois mois, et les tissages ou extensions demandent une pause après six à huit semaines.
6. **Protéger les cheveux la nuit** avec un foulard ou un bonnet en satin, ou une taie d'oreiller en satin, pour réduire les frottements.
7. **Couper les pointes abîmées** régulièrement. Une pointe fourchue continue de se fendre vers le haut : la couper sauve la longueur.

## Notre routine Cure's Nappy pour la pousse

- **Une fois par semaine :** lavage doux avec le Shampoing Doux & Clarifiant, puis Masque Hydratant & Protéiné 30 minutes sous un bonnet.
- **Après chaque lavage :** Leave-in Conditionner, Crème Hydratante & Volume+ mèche par mèche, puis quelques gouttes d'Huile 2 en 1 sur les pointes.
- **3 à 4 fois par semaine :** massage du cuir chevelu avec l'Huile Extra Pousse.
- **Tous les 2 à 3 jours :** Magical Spray pour rafraîchir l'hydratation.

Soyez patiente : il faut plusieurs mois de routine régulière pour voir la différence sur la longueur. Prenez une photo de dos chaque mois, au même endroit, pour mesurer vos progrès.`,
    references: [KOYAMA, AAD_BLACK_HAIR, AAD_STYLING, JHU_TRACTION],
    productIds: ["8", "4", "3", "9"],
  },
  {
    id: "hydratation-longue-duree",
    icon: "drop",
    title: "Hydratation longue durée : la méthode LOC expliquée",
    intro: "Des cheveux qui restent souples plusieurs jours, ça s'apprend. Liquide, huile, crème : l'ordre compte, et voici pourquoi.",
    image: "asset:slide-1",
    body: `Vous hydratez vos cheveux le matin et ils sont déjà secs le soir ? C'est fréquent avec les cheveux crépus et bouclés, naturellement très secs. La bonne nouvelle : avec une méthode simple, l'hydratation peut tenir plusieurs jours.

## Pourquoi les cheveux crépus se dessèchent si vite

Le sébum produit par le cuir chevelu descend mal le long des boucles serrées, et l'eau apportée au lavage s'évapore vite si rien ne la retient. Le climat chaud, le vent, la climatisation et le frottement contre les vêtements accélèrent encore le dessèchement. L'Académie américaine de dermatologie conseille d'utiliser des produits qui apportent et préservent l'hydratation, et d'éviter les routines qui l'enlèvent.

> Le secret n'est pas d'ajouter beaucoup de produit, mais de mettre la bonne couche au bon moment pour enfermer l'eau dans la fibre.

## La méthode LOC, étape par étape

**L comme Liquide.** L'hydratation, c'est d'abord de l'eau. Sur cheveux propres et encore humides (ou après un passage de spray), appliquez un soin à base d'eau.

**O comme Oil (huile).** L'huile forme un film léger qui ralentit l'évaporation de l'eau. Quelques gouttes suffisent, surtout sur les longueurs et les pointes.

**C comme Crème.** La crème nourrit, assouplit, définit et vient « sceller » le tout.

Certaines chevelures préfèrent l'ordre **LCO** (liquide, crème, puis huile) : testez les deux pendant deux semaines chacune et gardez celui qui laisse vos cheveux les plus souples.

## Notre routine LOC avec les soins Cure's Nappy

1. **L :** Magical Spray ou Leave-in Conditionner sur cheveux humides, section par section.
2. **O :** Huile 2 en 1, quelques gouttes réchauffées dans les paumes.
3. **C :** Crème Hydratante & Volume+, mèche par mèche, en lissant de la racine vers les pointes.
4. **Entre deux lavages :** un voile de Magical Spray tous les 2 à 3 jours, puis un peu d'huile sur les pointes.

## Les gestes qui font durer l'hydratation

- **Laver sans décaper.** Pour les cheveux crépus, l'Académie américaine de dermatologie conseille un lavage environ une fois par semaine ou toutes les deux semaines, avec un après-shampoing à chaque fois, en insistant sur les pointes, la partie la plus ancienne et la plus fragile du cheveu.
- **Un bain d'huile deux fois par mois.** Les dermatologues recommandent un soin à l'huile chaude environ deux fois par mois pour apporter souplesse et élasticité. Notre Bain d'Huile s'applique sur les longueurs, au moins une heure avant le lavage.
- **Dormir protégée.** Un foulard ou un bonnet en satin évite que le coton n'absorbe l'hydratation pendant la nuit.
- **Travailler en petites sections.** Les produits pénètrent mieux, et vous démêlez avec moins de casse.

## Trop sec ou trop mou ? Trouver l'équilibre

Un cheveu bien hydraté est souple et élastique : étiré doucement, il revient à sa forme.
- **Cheveu rêche, cassant, qui ne s'étire pas :** il manque d'hydratation. Ajoutez une étape « L » et un bain d'huile.
- **Cheveu mou, qui s'étire beaucoup sans revenir, qui « fond » :** il a besoin de force. Faites un Masque Hydratant & Protéiné ou un Masque Fortifiant.

> Écoutez vos cheveux : la routine idéale est celle que vous ajustez selon leur toucher, pas celle que vous appliquez sans regarder.`,
    references: [AAD_BLACK_HAIR, AAD_HEALTHY, AAD_STOP_DAMAGE],
    productIds: ["5", "3", "4", "9"],
  },
];

export const defaultAdvice: ArticleContent[] = [
  {
    id: "chute-des-cheveux",
    icon: "shield-alert",
    title: "Chute des cheveux : comprendre les causes et agir à temps",
    intro: "Perdre quelques cheveux chaque jour est normal. Une perte qui s'accélère, des tempes qui reculent ou une zone qui s'éclaircit ne le sont pas. Voici comment faire la différence et que faire.",
    image: "asset:slide-3",
    body: `Retrouver des cheveux dans la brosse peut faire peur. Avant de paniquer, il faut savoir de quoi on parle : **chute normale**, **casse** ou **vraie perte de cheveux**. Ce ne sont pas les mêmes problèmes et ils ne se soignent pas de la même façon.

## Chute normale, casse ou perte de cheveux ?

- **La chute normale :** chaque cheveu vit plusieurs années, puis tombe pour laisser la place à un nouveau. Perdre une cinquantaine à une centaine de cheveux par jour est habituel. Chez les cheveux crépus, souvent coiffés en tresses ou démêlés une fois par semaine, ces cheveux restent pris dans la chevelure et tombent tous au même moment : ce « paquet » impressionne mais peut être normal.
- **La casse :** ce sont des morceaux de cheveux, sans racine. C'est un problème de fragilité de la fibre (sécheresse, chaleur, produits chimiques, frottements). Voir notre guide [pour stimuler la pousse](/conseils/stimuler-la-pousse).
- **La vraie perte :** les cheveux tombent avec leur racine (un petit bulbe blanc au bout), en quantité inhabituelle, ou des zones se dégarnissent (tempes, raie, sommet du crâne).

> Signe d'alerte : si vous voyez votre cuir chevelu là où vous ne le voyiez pas avant, ou si la perte s'accompagne de démangeaisons, de brûlures ou de douleur, consultez un dermatologue sans attendre. Plus le diagnostic est précoce, plus le traitement est efficace.

## Les causes les plus fréquentes

**1. Les coiffures qui tirent (alopécie de traction).** C'est la cause de perte de cheveux la plus fréquente chez les femmes noires. Une revue de Johns Hopkins publiée en 2016 dans le Journal of the American Academy of Dermatology estime qu'environ une femme afro-américaine sur trois en est touchée. Les tresses serrées, les tissages, les extensions et les locks, surtout sur cheveux défrisés, sont les styles les plus à risque. La perte commence souvent sur les tempes et la ligne frontale. Bonne nouvelle : prise tôt, elle peut s'arrêter et même régresser. Laissée trop longtemps, elle peut devenir définitive.

**2. Les produits chimiques et la chaleur.** Défrisants, colorations et fer à lisser fragilisent la fibre et le cuir chevelu. Lire notre article sur [les défrisants](/conseils/defrisants-sante).

**3. Un choc pour l'organisme (effluvium télogène).** Un accouchement, une forte fièvre, une opération, une grande fatigue ou un stress important peuvent provoquer, deux à trois mois plus tard, une chute diffuse sur toute la tête. Elle est en général temporaire, une fois la cause passée.

**4. Les carences et certains déséquilibres.** Un manque de fer, une alimentation trop pauvre en protéines, un problème de thyroïde ou l'arrêt d'une pilule peuvent aussi faire tomber les cheveux. Seul un médecin, avec une prise de sang, peut le confirmer.

**5. L'alopécie androgénétique féminine.** C'est la cause la plus fréquente de chute chez les femmes en général, souvent à partir de la quarantaine : la raie s'élargit et le dessus de la tête s'éclaircit progressivement.

**6. Les maladies du cuir chevelu.** Certaines, comme l'alopécie centrale centrifuge cicatricielle (au sommet du crâne) ou la pelade (des plaques rondes), demandent un dermatologue. Voir notre article sur [les maladies du cuir chevelu](/conseils/maladies-du-cuir-chevelu).

## 8 gestes pour limiter la chute

1. **Desserrez vos coiffures.** Une tresse ou un tissage ne doit jamais faire mal, ni donner des petits boutons à la racine. Si c'est le cas, faites-le défaire.
2. **Alternez les styles** et laissez des pauses entre deux coiffures protectrices : pas plus de deux à trois mois pour des tresses, une pause après six à huit semaines de tissage ou d'extensions.
3. **Évitez de toujours tirer au même endroit** (queue de cheval serrée, chignon tendu sur les tempes).
4. **Réduisez la chaleur et les produits chimiques**, surtout pendant une période de chute.
5. **Massez votre cuir chevelu** 3 à 4 fois par semaine avec l'Huile Extra Pousse, en douceur.
6. **Fortifiez la fibre** avec une cure de Masque Fortifiant une fois par semaine pendant un mois, puis toutes les deux semaines.
7. **Mangez varié** : protéines (poisson, œufs, légumineuses), fer (légumes verts, viande), fruits et légumes.
8. **Consultez** si la chute dure plus de trois mois, si des zones se dégarnissent ou si votre cuir chevelu vous fait mal.

> Les soins Cure's Nappy accompagnent une routine de cheveux en bonne santé. Ils ne remplacent pas un traitement médical quand la chute a une cause médicale.`,
    references: [
      JHU_TRACTION,
      { title: "Hair loss in women: causes — American Academy of Dermatology", url: "https://www.aad.org/public/diseases/hair-loss/causes/women" },
      { title: "Hair loss: 18 causes — American Academy of Dermatology", url: "https://www.aad.org/public/diseases/hair-loss/causes/18-causes" },
      { title: "Female pattern hair loss — American Academy of Dermatology", url: "https://www.aad.org/public/diseases/hair-loss/types/female-pattern" },
      AAD_STYLING,
      AAD_BLACK_HAIR,
    ],
    productIds: ["8", "10", "4", "7"],
  },
  {
    id: "pellicules",
    icon: "sparkles",
    title: "Pellicules ou cuir chevelu sec ? Les reconnaître et s'en débarrasser",
    intro: "Des petites peaux blanches, des démangeaisons… Ce n'est pas toujours de la sécheresse. Voici comment savoir ce que vous avez, et la routine qui marche.",
    image: "asset:slide-6",
    body: `Les pellicules font partie des soucis les plus fréquents, et les plus mal compris. Beaucoup de personnes aux cheveux crépus pensent avoir le cuir chevelu « sec » et le couvrent de pommade… ce qui peut aggraver de vraies pellicules. Avant de traiter, il faut donc reconnaître le problème.

## Cuir chevelu sec ou pellicules ?

- **Cuir chevelu sec :** petites peaux fines, blanches, qui tombent facilement ; la peau tire, surtout après un lavage trop décapant ou un séjour en climatisation. Il s'améliore quand on hydrate.
- **Pellicules :** squames plus grosses, parfois jaunâtres ou grasses, collées au cuir chevelu, avec des démangeaisons. Elles sont liées à une levure naturellement présente sur la peau (Malassezia) qui se développe trop. Quand c'est plus important, on parle de **dermite séborrhéique**.

> Sur peau noire, la dermite séborrhéique ne paraît pas toujours rouge : on voit surtout des squames et parfois des zones un peu plus claires en dessous.

**Le test simple des deux semaines :** pendant deux semaines, arrêtez les produits agressifs et hydratez bien votre cuir chevelu. Si la sécheresse s'améliore mais que les squames reviennent, ce sont probablement des pellicules.

## Ce que conseillent les dermatologues

L'Académie américaine de dermatologie recommande un **shampoing antipelliculaire** contenant l'un de ces actifs : pyrithione de zinc, acide salicylique, soufre, sulfure de sélénium, kétoconazole ou goudron. Si l'un ne marche pas, on peut alterner avec un autre actif.

Pour les cheveux crépus, bouclés ou épais, elle conseille de :
1. **Laver quand c'est nécessaire**, et utiliser le shampoing antipelliculaire **environ une fois par semaine**, si votre cuir chevelu le supporte.
2. L'appliquer **uniquement sur le cuir chevelu**, pas sur les longueurs, car ses actifs peuvent dessécher le cheveu.
3. **Le laisser poser** le temps indiqué sur le flacon (souvent 5 à 10 minutes) avant de rincer.
4. Utiliser ensuite vos soins habituels sur les longueurs.

> Laver trop rarement favorise les pellicules : chez les cheveux crépus, espacer les lavages de plus de deux semaines laisse s'accumuler sébum, produits et squames.

## Notre routine anti-pellicules

1. **Une fois par semaine**, lavez le cuir chevelu avec le Shampoing Doux & Clarifiant en massant du bout des doigts. En cas de vraies pellicules, alternez avec un shampoing antipelliculaire médical.
2. **Rincez abondamment** : un reste de produit irrite le cuir chevelu.
3. **Hydratez les longueurs** avec le Leave-in Conditionner et le Magical Spray, mais gardez les crèmes épaisses et les beurres **sur les longueurs, pas sur le cuir chevelu**.
4. **Le Duo Anti-pelliculaire** (Shampoing Doux & Clarifiant + Huile Extra Pousse) aide à garder un cuir chevelu propre et massé entre deux lavages. Appliquez l'huile en petite quantité, directement sur les raies.

## Les erreurs à éviter

- **Gratter avec les ongles ou un peigne pointu** : vous abîmez la peau et entretenez l'irritation.
- **Recouvrir le cuir chevelu de graisse ou de pommade épaisse** : cela peut nourrir la levure responsable des pellicules.
- **Laisser une coiffure protectrice des semaines sans laver le cuir chevelu.** Pendant les tresses, nettoyez les raies avec un coton imbibé d'un peu de shampoing dilué, puis rincez au spray d'eau.
- **L'eau trop chaude**, qui irrite et dessèche.

## Quand consulter

Consultez un dermatologue si les pellicules persistent malgré un shampoing antipelliculaire, si votre cuir chevelu est rouge, suintant, très épais par plaques, douloureux, ou si vous perdez des cheveux. Il peut s'agir d'une dermite séborrhéique, d'un psoriasis, d'un eczéma ou d'une teigne (une infection par un champignon, fréquente chez les enfants), qui demandent un traitement adapté.`,
    references: [
      { title: "How to treat dandruff — American Academy of Dermatology", url: "https://www.aad.org/dermatology-a-to-z/health-and-beauty/hair-care/dandruff-how-to-treat" },
      { title: "Dandruff vs dry scalp on Black hair — Black Health", url: "https://www.blackhealth.org/articles/dandruff-vs-dry-scalp-black-hair/" },
      AAD_BLACK_HAIR,
    ],
    productIds: ["2", "8", "3", "5"],
  },
  {
    id: "defrisants-sante",
    icon: "alert",
    title: "Défrisants : ce que disent vraiment les études sur votre santé",
    intro: "Brûlures, casse, et des études qui interrogent sur certains cancers. Voici les faits, sans exagération, pour décider en connaissance de cause.",
    image: "asset:hero-image",
    body: `Le défrisage a longtemps été présenté comme la seule façon d'avoir des cheveux « faciles ». Aujourd'hui, de plus en plus de femmes reviennent au naturel, et de grandes études scientifiques se sont penchées sur ces produits. Voici ce que l'on sait, et ce que l'on ne sait pas encore.

## Comment agit un défrisant

Un défrisant contient un produit très basique qui **casse les liaisons** qui donnent sa forme au cheveu. C'est définitif : le cheveu défrisé ne retrouvera jamais sa boucle, seule la repousse sera naturelle.
- Les défrisants **« avec soude »** (hydroxyde de sodium) sont les plus puissants.
- Les défrisants **« sans soude »** (souvent à base de guanidine) irritent moins le cuir chevelu, mais dessèchent davantage et sont souvent laissés poser trop longtemps.

> « Sans soude » ne veut pas dire « sans danger » : tout défrisant mal utilisé peut brûler le cuir chevelu.

## Les risques connus et immédiats

- **Les brûlures du cuir chevelu.** Ce sont les accidents les plus fréquents, surtout si le produit pose trop longtemps ou sur une peau déjà irritée (après un grattage ou des tresses serrées).
- **La casse.** Le cheveu défrisé est plus fragile. La casse est maximale à la jonction entre la partie défrisée et la repousse naturelle.
- **Les pellicules et démangeaisons**, rapportées par de nombreuses utilisatrices.
- **Des cicatrices et une perte de cheveux définitive.** Des cas d'alopécie cicatricielle au sommet du crâne ont été décrits chez des femmes qui avaient ressenti des brûlures pendant un défrisage.

## Ce que disent les grandes études sur le cancer

**Le cancer de l'utérus.** En 2022, une étude américaine financée par les Instituts nationaux de la santé (NIH), la Sister Study, a suivi près de 34 000 femmes pendant environ 11 ans. Les femmes qui avaient utilisé des produits lissants chimiques dans l'année précédant l'étude avaient un risque de cancer de l'utérus **environ 1,8 fois plus élevé** que celles qui n'en avaient pas utilisé. Chez les utilisatrices fréquentes (plus de quatre fois par an), le risque était **plus de deux fois plus élevé**. Les autres produits capillaires (colorations, permanentes) n'étaient pas associés à ce cancer.

**Le cancer du sein.** Une autre analyse de la même étude, publiée fin 2019, a observé un risque un peu plus élevé chez les utilisatrices de lissants chimiques, d'environ 30 % pour les plus fréquentes (toutes les cinq à huit semaines). Les participantes avaient toutes une sœur atteinte d'un cancer du sein, ce qui limite la généralisation des résultats.

> Ces études montrent une **association**, pas une preuve que le défrisant cause le cancer. Les chercheurs n'ont pas pu identifier quels produits ou ingrédients étaient en cause, et d'autres études doivent confirmer ces résultats. Mais le signal est suffisamment sérieux pour être pris en compte.

**Les lissages au formaldéhyde.** Certains lissages (comme ceux dits « brésiliens » ou « à la kératine ») libèrent du formaldéhyde quand on les chauffe, un produit reconnu comme cancérogène. Aux États-Unis, la FDA a proposé de les interdire, mais l'interdiction n'était toujours pas adoptée fin 2026 ; plusieurs États américains les ont déjà bannis.

## Si vous continuez à défriser : réduire les risques

L'Académie américaine de dermatologie donne ces règles :
1. **Faites-le faire par un professionnel.**
2. **Espacez les retouches** de deux à trois mois au minimum.
3. **Appliquez le produit uniquement sur la repousse**, jamais sur des cheveux déjà défrisés.
4. **Protégez le cuir chevelu** avec une base protectrice avant l'application.
5. **Ne défrisez jamais un cuir chevelu irrité**, gratté ou fraîchement tressé.
6. **Rincez immédiatement** si cela brûle : la sensation de brûlure n'est pas « normale ».

## Revenir au naturel : la transition en douceur

Deux options :
- **La coupe franche (big chop)** : on coupe toute la partie défrisée. C'est radical, mais vos cheveux repartent en pleine santé.
- **La transition progressive** : on laisse pousser le naturel et on coupe la partie défrisée petit à petit. Attention, la jonction entre les deux textures est très fragile : hydratation, démêlage doux et coiffures protectrices sans tension sont indispensables.

Pendant la transition, misez sur l'hydratation (Leave-in Conditionner, Crème Hydratante & Volume+), la force (Masque Hydratant & Protéiné, Masque Fortifiant) et la patience. Nos [gammes complètes](/nos-gammes) sont pensées pour accompagner ce retour au naturel.`,
    references: [
      { title: "Chang et al. — Use of straighteners and other hair products and incident uterine cancer (Journal of the National Cancer Institute, 2022)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9949582" },
      { title: "Hair straightening chemicals associated with higher uterine cancer risk — ScienceDaily (NIH)", url: "https://www.sciencedaily.com/releases/2022/10/221017102353.htm" },
      { title: "Permanent hair dye and straighteners may increase breast cancer risk — National Institutes of Health", url: "https://www.nih.gov/news-events/news-releases/permanent-hair-dye-straighteners-may-increase-breast-cancer-risk" },
      { title: "FDA misses another deadline on proposed ban on formaldehyde in hair-straightening products — WRAL", url: "https://www.wral.com/story/fda-misses-another-deadline-on-proposed-ban-on-formaldehyde-in-hair-straightening-products/22296027/" },
      { title: "Contemporary African-American hair care practices — Practical Dermatology", url: "https://practicaldermatology.com/2015/05/contemporary-african-american-hair-care-practices" },
      AAD_BLACK_HAIR,
    ],
    productIds: ["3", "9", "7", "10"],
  },
  {
    id: "maladies-du-cuir-chevelu",
    icon: "lightbulb",
    title: "Les maladies du cuir chevelu : les reconnaître pour mieux réagir",
    intro: "Plaques sans cheveux, démangeaisons qui durent, boutons à la racine… Certains signes ne relèvent plus de la routine beauté. Voici les plus fréquents et quand consulter.",
    image: "asset:slide-5",
    body: `Un cuir chevelu en bonne santé, c'est la base de beaux cheveux. Certaines maladies, pourtant fréquentes, passent longtemps inaperçues ou sont confondues avec une simple sécheresse. Les connaître permet de consulter au bon moment, avant que les dégâts ne soient définitifs.

> Ce guide vous aide à reconnaître des signes, pas à poser un diagnostic. Seul un médecin ou un dermatologue peut le faire.

## 1. L'alopécie de traction

**Ce que c'est :** une perte de cheveux causée par une tension répétée sur les racines (tresses serrées, tissages, extensions, chignons tirés).
**Les signes :** tempes et ligne frontale qui reculent, petits boutons ou douleur à la racine après une nouvelle coiffure, cheveux plus fins sur les bords.
**Que faire :** desserrer immédiatement les coiffures, alterner les styles, laisser le cuir chevelu au repos. Prise tôt, elle peut régresser ; ignorée, elle peut devenir définitive. Lire aussi [notre article sur la chute](/conseils/chute-des-cheveux).

## 2. L'alopécie centrale centrifuge cicatricielle (ACCC)

**Ce que c'est :** une maladie qui touche surtout les femmes noires. Elle commence au sommet du crâne et s'étend en cercle, en détruisant les racines (cicatrice).
**Les signes :** cheveux qui cassent au sommet du crâne, zone qui s'éclaircit, parfois démangeaisons, sensibilité ou brûlure avant même la perte de cheveux.
**Que faire :** consulter un dermatologue rapidement. Les racines détruites ne repoussent pas : le traitement sert à arrêter la progression, d'où l'importance d'agir tôt. Évitez les coiffures qui tirent et les produits agressifs.

## 3. La dermite séborrhéique

**Ce que c'est :** la forme marquée des pellicules, liée à une levure de la peau.
**Les signes :** squames grasses ou jaunâtres, démangeaisons, parfois aussi sur les sourcils ou derrière les oreilles. Sur peau noire, la rougeur est souvent peu visible.
**Que faire :** shampoing antipelliculaire une fois par semaine, et un dermatologue si cela persiste. Tout est détaillé dans [notre article sur les pellicules](/conseils/pellicules).

## 4. La pelade (alopécie areata)

**Ce que c'est :** une maladie auto-immune : le système de défense du corps attaque les racines des cheveux. Elle peut toucher tout le monde, à tout âge, souvent avant 40 ans, et c'est la perte de cheveux la plus fréquente chez l'enfant.
**Les signes :** une ou plusieurs plaques rondes, lisses, sans cheveux, apparues rapidement ; parfois des petites marques sur les ongles.
**Que faire :** consulter. Il n'existe pas de traitement qui guérit définitivement, mais plusieurs traitements aident les cheveux à repousser, et ils ont parfois repoussé seuls.

## 5. La trichorrhexie noueuse

**Ce que c'est :** des cheveux qui forment de petits points blancs (des « nœuds ») le long de la tige et se cassent à cet endroit.
**Les causes :** surtout les agressions répétées (chaleur, défrisants, colorations, démêlage brutal).
**Que faire :** arrêter la chaleur et les produits chimiques, démêler sur cheveux humides et hydratés, couper les parties abîmées. Le cheveu qui repousse est normal si l'on change ses habitudes.

## 6. La folliculite

**Ce que c'est :** une inflammation des racines, souvent par des bactéries.
**Les signes :** petits boutons rouges ou blancs autour des cheveux, qui démangent ou font mal, souvent après des tresses serrées, un rasage ou des produits gras sur le cuir chevelu.
**Que faire :** desserrer les coiffures, garder le cuir chevelu propre, ne pas percer les boutons. S'ils durent, grossissent ou s'accompagnent de fièvre, consultez.

## Les réflexes pour un cuir chevelu en bonne santé

- Lavez-le au moins toutes les une à deux semaines, même sous coiffure protectrice.
- Ne laissez jamais une coiffure faire mal.
- Massez-le en douceur avec la pulpe des doigts.
- Gardez les produits épais sur les longueurs, pas sur la peau.
- Observez-le une fois par mois avec un miroir : zone qui s'éclaircit, plaques, boutons.

> Ne laissez pas traîner : la plupart de ces maladies se soignent bien mieux quand on les prend au début.`,
    references: [
      JHU_TRACTION,
      { title: "Central centrifugal cicatricial alopecia: an overview — The Dermatologist", url: "https://www.hmpgloballearningnetwork.com/site/thederm/clinical-review/central-centrifugal-cicatricial-alopecia-overview-disease-and-0" },
      { title: "Alopecia areata: signs and symptoms — American Academy of Dermatology", url: "https://www.aad.org/public/diseases/hair-loss/types/alopecia/symptoms" },
      { title: "How to treat dandruff — American Academy of Dermatology", url: "https://www.aad.org/dermatology-a-to-z/health-and-beauty/hair-care/dandruff-how-to-treat" },
      AAD_STOP_DAMAGE,
    ],
    productIds: ["2", "10", "8"],
  },
];
