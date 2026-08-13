# JANNAR Custom Studio

Build a Custom Print-on-Demand Clothing Store

I want you to build a modern custom print-on-shirt / print-on-hoodie e-commerce website.

This is NOT a website where users customize the actual clothing design from scratch like a fashion designer. The main purpose is to sell shirts and hoodies where customers can upload their own images, add custom text/fonts, and position those designs on the front and/or back of the clothing.

The website should feel like a real streetwear brand/store and should be heavily inspired by the visual style, colors, branding, and layout shown in the reference images I uploaded.

IMPORTANT — Uploaded Reference Images

Use the uploaded images as visual references for the website.

They show:

JANNAR branding / logo

 Use the JANNAR logo as the main brand identity.

 The black/cream/white color combination should influence the site's branding.

 Use the logo appropriately in the navbar, footer, favicon, product pages, etc.

 Don't distort or redesign the logo.

JANNAR shirt example

 Use this as inspiration for how products should be presented.

 The store should have a streetwear aesthetic.

 Products can have designs printed on the front and back.

Clothing measurement image

 Use this as the visual reference for the size/dimensions section.

 When a customer scrolls down on a product page, show a similar measurement image explaining the dimensions.

1. Website Structure

Every page must have its own separate HTML file.

Do NOT create a regions.html page.

Example structure:

index.html
shop.html
product.html
customize.html
cart.html
checkout.html
account.html

Keep each page separated and organized.

Do not put the entire website into one giant HTML file.

Use reusable CSS/JS where appropriate, but each actual page should have its own HTML file.

2. Design / Visual Style

The website should have a premium streetwear aesthetic.

Use the uploaded JANNAR branding as inspiration.

Main visual direction:

 Black

 Off-white / cream

 White

 Very subtle gray tones

 Small amounts of accent color where appropriate

The website should feel:

 Minimal

 Premium

 Streetwear-inspired

 Modern

 Clean

 Slightly edgy

 Not corporate

 Not overly colorful

Use strong typography and good spacing.

The design should feel like an actual clothing brand rather than a generic Shopify template.

3. MOBILE / LOW-END PHONE OPTIMIZATION

This is VERY important.

The website needs to work extremely well on low-end Android phones and slower devices.

Prioritize performance.

Avoid:

 Heavy animations

 Excessive JavaScript

 Huge libraries

 Autoplay videos

 Unnecessary 3D effects

 Excessive blur effects

 Huge image downloads

 Complicated animations that cause lag

Prioritize:

 Fast loading

 Compressed images

 Lazy-loaded product images

 Simple CSS

 Responsive layouts

 Touch-friendly buttons

 Small bundle sizes

 Good performance on 3G/4G

 No horizontal scrolling

The website should still look premium even when running on an inexpensive phone.

4. Navbar / Region Selector

REMOVE regions.html.

Instead, put the region selector directly in the website navigation/header.

The region selector should display an actual flag image, NOT emoji flags.

Do not use:

🇪🇬 🇵🇸 🇯🇴

Use proper flag graphics/SVGs instead.

For example:

 Egypt — EG

 Palestine — PS

 Jordan — JO

The exact countries/regions can be expanded later.

Region interaction

When the user clicks the flag:

Open a slide-down dropdown menu.

The dropdown should contain:

 Flag

 Country/region name

 Country/region code

Example:

🇪🇬 Egypt       EG
🇵🇸 Palestine   PS
🇯🇴 Jordan      JO

But again, use real SVG/image flags, not emoji.

The dropdown should:

 Animate smoothly

 Be lightweight

 Work on mobile

 Close when clicking outside

 Clearly show the currently selected region

The selected flag should remain visible in the navbar.

5. Homepage

Create a strong streetwear-style homepage.

Include:

Hero section

Large branding / JANNAR logo.

Example messaging:

CUSTOM PRINTS. YOUR STYLE.

Allow the user to immediately:

 Shop Shirts

 Shop Hoodies

 Create Your Design

Keep the hero simple and fast-loading.

6. Product Store

Create a product/shop page.

Products should include:

 T-shirts

 Hoodies

 Different colors

 Different sizes

 Product images

 Prices

 Front/back previews where available

Product cards should be clean and minimal.

Example:

[PRODUCT IMAGE]

JANNAR TEE
$XX

Black
S M L XL XXL

[Customize]

7. Product Page

When a customer clicks a product, show a proper product page.

Include:

 Large product image

 Product name

 Price

 Available colors

 Sizes

 Description

 Customize button

 Add to cart button

The customer should be able to clearly understand what they're buying.

8. FRONT / BACK CLOTHING SWITCHER

This is VERY important.

On the product/customization page, add a clear switch between:

FRONT | BACK

For example:

       FRONT    BACK

        [SHIRT]

       [DESIGN]

When FRONT is selected:

Show the front of the shirt/hoodie.

When BACK is selected:

Show the back of the shirt/hoodie.

The user should be able to customize each side independently.

For example:

FRONT
→ Add image
→ Add text

BACK
→ Add image
→ Add text

Switching between front and back should preserve whatever the user already added to each side.

9. CUSTOM DESIGN TOOL

Add a simple custom design editor.

Think of a lightweight version of Kittl / Canva, but DO NOT try to recreate all of Kittl.

The editor should be simple, fast, and practical.

The user should be able to:

Add custom image

Allow the user to upload an image.

Example:

+ Add Image

After uploading, the image should appear on the shirt.

The user should be able to:

 Move the image

 Resize the image

 Rotate the image

 Delete the image

Use touch-friendly controls so this works on phones.

10. Custom Text

Add:

+ Add Text

The user should be able to type custom text.

Example:

JANNAR

Allow basic text customization:

 Font

 Font size

 Bold

 Italic

 Text color

 Alignment

 Rotation

 Position

 Resize

 Delete

Include a selection of good fonts.

The font picker should be simple and lightweight.

Do not load hundreds of fonts.

Use a small curated selection.

11. DESIGN CANVAS

The editor should visually show the clothing.

For example:

       FRONT

    ┌───────────┐
    │           │
    │   SHIRT   │
    │           │
    │  [IMAGE]  │
    │           │
    │  "TEXT"   │
    │           │
    └───────────┘

 [Add Image] [Add Text]

The design should appear inside the printable area of the shirt.

Show a subtle printable-area boundary so the customer understands where their design can go.

Do NOT allow users to accidentally position designs completely outside the printable area.

12. Front and Back Designs Must Be Independent

The user needs separate designs for each side.

For example:

Front

Small JANNAR logo

Back

Large custom photo
Custom text

When switching:

FRONT ←→ BACK

the designs should stay saved.

Do not reset the design when switching sides.

13. Shirt AND Hoodie Support

The customization system should work for both:

T-shirts

and

Hoodies

The user should be able to select:

T-Shirt
Hoodie

Then show the appropriate product mockup.

Both should support:

 Front customization

 Back customization

 Images

 Text

 Positioning

 Resizing

 Rotation

14. Product Dimensions / Size Guide

This is another VERY important feature.

When a user opens a product and scrolls down, show a dedicated:

SIZE & DIMENSIONS

section.

Use the uploaded dimensions/measurement image as the visual reference.

Show an image explaining measurements such as:

A = Length
B = Width

Then include a table underneath.

Example:

SizeABS5854M6057L6260XL6563XXL6866XXXL7069

The actual measurements should be configurable rather than hard-coded forever.

The dimensions image must:

 Be responsive

 Scale correctly on phones

 Never overflow the screen

 Remain readable

 Have rounded corners if appropriate

 Load efficiently

15. Product Image Gallery

Allow multiple product images.

For example:

[Front]

[Back]

[Close-up]

[Design detail]

[Size guide]

On mobile, use a lightweight swipeable gallery.

Do not use huge image files.

16. Cart

Create a proper shopping cart.

The cart should show:

 Product

 Color

 Size

 Quantity

 Front design thumbnail

 Back design thumbnail

 Price

 Total

Example:

JANNAR Custom Tee
Black / XL

Front: Custom Design
Back: Custom Image

Qty: 1

$XX

----------------

Total: $XX

[Checkout]

17. Checkout

Create a clean checkout page.

Keep it simple and mobile friendly.

Include:

 Customer information

 Shipping information

 Region

 Order summary

 Payment section

 Place order

Make sure the selected region from the navbar can be used throughout the shopping experience.

18. Design Data

The custom design should be saved as structured data rather than just treating the entire editor as one image.

For example, conceptually:

front:
  - image
  - text
  - position
  - scale
  - rotation

back:
  - image
  - text
  - position
  - scale
  - rotation

This allows the design to remain editable.

19. Touch Controls

The editor MUST work properly on mobile.

Users should be able to:

 Tap an element

 Drag it

 Pinch to resize

 Rotate where possible

 Delete it

 Switch front/back

 Add text

 Upload photos

Make controls large enough for fingers.

Do not create tiny desktop-only controls.

20. UI Details

Use subtle interactions such as:

 Hover effects on desktop

 Small transitions

 Slide-down region selector

 Smooth front/back switching

 Button feedback

 Selected states

But keep animations extremely lightweight because the website needs to perform well on low-end phones.

21. Branding

Use the uploaded JANNAR logo assets throughout the website where appropriate.

Use:

 Main logo for branding

 Text-only logo where it makes sense

 Small logo/icon for favicon/mobile areas

Keep the logo's proportions correct.

Do not stretch it.

The branding should feel consistent across:

 Navbar

 Homepage

 Product pages

 Customizer

 Cart

 Checkout

 Footer

22. Responsive Layout

Desktop:

NAVBAR
--------------------------------

HERO

PRODUCT GRID
[PRODUCT] [PRODUCT] [PRODUCT] [PRODUCT]

FEATURES

FOOTER

Mobile:

NAVBAR

HERO

PRODUCT
PRODUCT

PRODUCT
PRODUCT

FOOTER

The entire website should adapt naturally to small screens.

23. Important Technical Requirement

Do not over-engineer this.

The goal is a fast, polished, functional MVP.

Prioritize:

 Working product pages

 Working customizer

 Front/back switching

 Image upload

 Custom text

 Shirt/hoodie switching

 Size guide

 Region selector

 Cart

 Mobile performance

Everything should be structured so additional features can be added later.

24. Final Design Goal

The final result should feel like:

JANNAR — a modern Palestinian/streetwear-inspired custom print clothing brand.

It should NOT look like:

 A generic e-commerce template

 A boring clothing catalog

 A complicated professional graphic-design application

 A website overloaded with animations

Instead, make it feel like a real modern streetwear brand with a simple Kittl-style custom print editor built into the shopping experience.

The customer journey should be:

Homepage
   ↓
Shop
   ↓
Choose Shirt / Hoodie
   ↓
Choose Color + Size
   ↓
Customize
   ↓
FRONT ↔ BACK
   ↓
Add Image / Add Text
   ↓
Preview
   ↓
View Size Guide
   ↓
Add to Cart
   ↓
Checkout

Build the UI and functionality around this flow.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://jannarbrand.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/33dc0e82-6504-4ec4-aa17-b83a71ec134a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
