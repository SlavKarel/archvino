# Content Schema Reference

This document describes the content collections schema for archvino.

## Shared Types

### LocalizedString

A bilingual string supporting Russian (`ru`) and English (`en`).

```yaml
title:
  ru: Заголовок
  en: Title
```

### Image

An image with source path and localized alt text.

```yaml
src: /src/assets/projects/example/cover.jpg
alt:
  ru: Описание изображения
  en: Image description
```

### Section

A content section with label, heading, and body.

```yaml
label:
  ru: Метка
  en: Label
heading:
  ru: Заголовок секции
  en: Section heading
body:
  ru: Текст секции
  en: Section body text
```

---

## Settings Collection

**File:** `src/content/settings/site.yaml`

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `studioName` | string | Yes | Name of the architecture studio |
| `logo` | Image | Yes | Studio logo image |
| `navigation` | object | Yes | Navigation labels for each page |
| `footerText` | LocalizedString | Yes | Footer description text |
| `localeLabels` | object | Yes | Language switcher labels |
| `defaultSeo` | object | Yes | Default SEO title and description |
| `contact` | object | Yes | Contact information |
| `socialLinks` | array | Yes | Array of social media links |

### Navigation Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `home` | LocalizedString | Yes | Home link label |
| `projects` | LocalizedString | Yes | Projects link label |
| `about` | LocalizedString | Yes | About link label |
| `services` | LocalizedString | Yes | Services link label |
| `contact` | LocalizedString | Yes | Contact link label |

### Contact Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Contact email address |
| `phone` | string | Yes | Contact phone number |
| `address` | LocalizedString | Yes | Studio address |
| `mapUrl` | string (url) | Yes | Google Maps link |

### Example

```yaml
studioName: Archvino
logo:
  src: /src/assets/site/logo.svg
  alt:
    ru: Логотип Archvino
    en: Archvino logo
navigation:
  home:
    ru: Главная
    en: Home
  projects:
    ru: Проекты
    en: Projects
  about:
    ru: О нас
    en: About
  services:
    ru: Услуги
    en: Services
  contact:
    ru: Контакты
    en: Contact
footerText:
  ru: Архитектурная практика для частных и общественных пространств.
  en: Architectural practice for private and public spaces.
localeLabels:
  ru:
    ru: Русский
    en: Russian
  en:
    ru: Английский
    en: English
defaultSeo:
  title:
    ru: Archvino | Архитектурное портфолио
    en: Archvino | Architecture Portfolio
  description:
    ru: Билингвальное портфолио архитектора с частными и общественными проектами.
    en: Bilingual architect portfolio with residential and public projects.
contact:
  email: hello@archvino.ru
  phone: +7 999 000 00 00
  address:
    ru: Москва, Россия
    en: Moscow, Russia
  mapUrl: https://maps.google.com/?q=Moscow,+Russia
socialLinks:
  - label:
      ru: Телеграм
      en: Telegram
    url: https://t.me/archvino
```

---

## Pages Collection

**Directory:** `src/content/pages/`

The pages collection uses a discriminated union based on the `id` field. Each page type has its own schema.

---

### Home Page

**File:** `src/content/pages/home.yaml`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | literal `"home"` | Yes | Page identifier |
| `headline` | LocalizedString | Yes | Main headline text |
| `intro` | LocalizedString | Yes | Introduction paragraph |
| `featuredProjectSlugs` | array of string | Yes (min 1) | List of project slugs to feature |
| `aboutPreview` | LocalizedString (partial) | No | Short about section preview |
| `servicesPreview` | LocalizedString (partial) | No | Short services section preview |
| `contactCta` | object | Yes | Contact call-to-action section |

#### ContactCta Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `heading` | LocalizedString | Yes | CTA heading |
| `body` | LocalizedString | Yes | CTA description |
| `label` | LocalizedString | Yes | Button label |

#### Example

```yaml
id: home
headline:
  ru: Тихая архитектура для повседневной жизни.
  en: Quiet architecture for everyday life.
intro:
  ru: Проектируем дома, интерьеры и общественные пространства с вниманием к свету, ритму и материалу.
  en: We design homes, interiors, and public spaces with attention to light, rhythm, and material.
aboutPreview:
  ru: Частная практика Archvino ведет проекты от первой идеи до авторского сопровождения реализации.
  en: Archvino is a private practice guiding projects from the first concept through construction supervision.
servicesPreview:
  ru: Архитектурная концепция, интерьер и сопровождение реализации собираются в один спокойный рабочий процесс.
  en: Architectural concept, interiors, and delivery support are shaped into one calm working process.
featuredProjectSlugs:
  - villa-moscow
  - gallery-house
  - studio-loft
contactCta:
  heading:
    ru: Обсудить будущий проект
    en: Discuss a future project
  body:
    ru: Напишите нам, чтобы обсудить участок, интерьер или реконструкцию.
    en: Write to us to discuss a site, interior, or renovation.
  label:
    ru: Связаться
    en: Contact us
```

---

### About Page

**File:** `src/content/pages/about.yaml`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | literal `"about"` | Yes | Page identifier |
| `title` | LocalizedString | Yes | Page title |
| `biography` | LocalizedString | Yes | Main biography text |
| `approach` | LocalizedString | Yes | Design approach description |
| `credentials` | LocalizedString | Yes | Credentials/awards text |
| `portrait` | Image | Yes | Portrait photo |

#### Example

```yaml
id: about
title:
  ru: О нас
  en: About
biography:
  ru: Биография...
  en: Biography...
approach:
  ru: Подход...
  en: Approach...
credentials:
  ru: Награды и квалификация...
  en: Credentials...
portrait:
  src: /src/assets/about/portrait.jpg
  alt:
    ru: Портрет архитектора
    en: Architect portrait
```

---

### Services Page

**File:** `src/content/pages/services.yaml`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | literal `"services"` | Yes | Page identifier |
| `title` | LocalizedString | Yes | Page title |
| `intro` | LocalizedString | Yes | Introduction text |
| `items` | array of LocalizedString | Yes (min 1) | List of services offered |
| `cta` | LocalizedString | Yes | Call-to-action text |

#### Example

```yaml
id: services
title:
  ru: Услуги
  en: Services
intro:
  ru: Введение в услуги...
  en: Services introduction...
items:
  - ru: Архитектурное проектирование
    en: Architectural design
  - ru: Дизайн интерьера
    en: Interior design
  - ru: Авторский надзор
    en: Construction supervision
cta:
  ru: Обсудить проект
  en: Discuss your project
```

---

### Contact Page

**File:** `src/content/pages/contact.yaml`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | literal `"contact"` | Yes | Page identifier |
| `heading` | LocalizedString | Yes | Page heading |
| `intro` | LocalizedString | Yes | Introduction text |
| `email` | string | Yes | Contact email |
| `phone` | string | Yes | Contact phone |
| `address` | LocalizedString | Yes | Studio address |
| `mapUrl` | string (url) | Yes | Google Maps link |
| `socialLinks` | array | Yes | Social media links |
| `formHelper` | LocalizedString | Yes | Helper text above form |
| `formLabels` | object | Yes | Form field labels |
| `formMessages` | object | Yes | Form validation/success messages |

#### FormLabels Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | LocalizedString | Yes | Name field label |
| `email` | LocalizedString | Yes | Email field label |
| `message` | LocalizedString | Yes | Message field label |
| `submit` | LocalizedString | Yes | Submit button label |

#### FormMessages Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `required` | LocalizedString | Yes | "Required" validation message |
| `invalidEmail` | LocalizedString | Yes | "Invalid email" message |
| `success` | LocalizedString | Yes | Success message |
| `error` | LocalizedString | Yes | Error message |
| `sending` | LocalizedString | Yes | Sending state message |

#### Example

```yaml
id: contact
heading:
  ru: Контакт
  en: Contact
intro:
  ru: Свяжитесь с нами удобным способом или оставьте короткое сообщение о проекте, сроках и контексте.
  en: Reach out directly or leave a short note about the project, timing, and context.
email: hello@archvino.ru
phone: +7 999 000 00 00
address:
  ru: Москва, Россия
  en: Moscow, Russia
mapUrl: https://maps.google.com/?q=Moscow,+Russia
socialLinks:
  - label:
      ru: Телеграм
      en: Telegram
    url: https://t.me/archvino
formHelper:
  ru: Достаточно нескольких предложений, чтобы мы подготовили содержательный первый ответ.
  en: A few clear sentences are enough for us to prepare a useful first response.
formLabels:
  name:
    ru: Имя
    en: Name
  email:
    ru: Электронная почта
    en: Email
  message:
    ru: Сообщение
    en: Message
  submit:
    ru: Отправить
    en: Send
formMessages:
  required:
    ru: обязательно
    en: required
  invalidEmail:
    ru: укажите корректный email
    en: enter a valid email
  success:
    ru: сообщение отправлено
    en: message sent
  error:
    ru: заполните обязательные поля или попробуйте снова
    en: fill the required fields or try again
  sending:
    ru: отправка...
    en: sending...
```

---

## Projects Collection

**Directory:** `src/content/projects/`

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | string | Yes | Project identifier (used in URLs) |
| `category` | enum | Yes | Project category: `residential`, `cultural`, `interiors` |
| `year` | integer | Yes | Project year |
| `location` | LocalizedString | Yes | Project location |
| `status` | LocalizedString | Yes | Project status (e.g., "Completed", "In progress") |
| `featured` | boolean | Yes | Whether to feature on homepage |
| `order` | integer | Yes | Display order (lower = appears first) |
| `title` | LocalizedString | Yes | Project title |
| `summary` | LocalizedString | Yes | Brief project summary |
| `cover` | Image | Yes | Cover image |
| `gallery` | array of Image | Yes (min 1) | Gallery images |
| `sections` | array of Section | Yes (min 1) | Project description sections |

### Example

```yaml
slug: villa-moscow
category: residential
year: 2024
location:
  ru: Подмосковье
  en: Moscow region
status:
  ru: В реализации
  en: In progress
featured: true
order: 1
title:
  ru: Вилла у сосен
  en: Villa Among Pines
summary:
  ru: Загородный дом, где план раскрывается вокруг света, сада и последовательности приватных комнат.
  en: A country house organized around light, the garden, and a sequence of private rooms.
cover:
  src: /src/assets/projects/villa-moscow/cover.jpg
  alt:
    ru: Фасад виллы среди сосен
    en: Villa facade among pine trees
gallery:
  - src: /src/assets/projects/villa-moscow/gallery-1.jpg
    alt:
      ru: Гостиная виллы с панорамным остеклением
      en: Villa living room with panoramic glazing
  - src: /src/assets/projects/villa-moscow/gallery-2.jpg
    alt:
      ru: Терраса виллы, выходящая в сад
      en: Villa terrace opening to the garden
  - src: /src/assets/projects/villa-moscow/gallery-3.jpg
    alt:
      ru: Лестница из дерева и светлого камня
      en: Stair built from timber and pale stone
sections:
  - label:
      ru: Контекст
      en: Context
    heading:
      ru: Дом встроен в лесной участок.
      en: The house is set into a wooded site.
    body:
      ru: Объемы развернуты так, чтобы сохранить существующие сосны и открыть основные помещения к южному свету.
      en: The volumes are arranged to preserve the existing pines and open the main rooms to southern light.
  - label:
      ru: Планировка
      en: Planning
    heading:
      ru: Пространства связаны спокойной анфиладой.
      en: The spaces are linked by a calm enfilade.
    body:
      ru: Общие комнаты собраны на первом уровне, а более тихие спальни и рабочие зоны подняты выше.
      en: Shared rooms are gathered on the first level while quieter bedrooms and work areas move above.
```

---

## Taxonomy Collection

**File:** `src/content/taxonomy/project-categories.yaml`

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `categories` | array | Yes | List of project categories |

### Category Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | string | Yes | Category identifier |
| `label` | LocalizedString | Yes | Category display label |

### Valid Categories

- `residential` — Жилые / Residential
- `cultural` — Культурные / Cultural
- `interiors` — Интерьеры / Interiors

### Example

```yaml
categories:
  - slug: residential
    label:
      ru: Жилые
      en: Residential
  - slug: cultural
    label:
      ru: Культурные
      en: Cultural
  - slug: interiors
    label:
      ru: Интерьеры
      en: Interiors
```