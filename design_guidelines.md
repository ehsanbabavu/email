# Design Guidelines: Temporary Email Application

## Design Approach: Material Design System
**Rationale:** Email applications demand clarity, hierarchy, and efficient information display. Material Design provides excellent patterns for data-dense interfaces with clear visual feedback for real-time updates.

**Reference Inspiration:** Gmail, ProtonMail, and Outlook's clean email management interfaces.

---

## Typography System

**Font Family:** 
- Primary: 'Inter' or 'Roboto' from Google Fonts
- Monospace: 'JetBrains Mono' for email addresses

**Type Scale:**
- Email Subject/Headers: text-lg font-semibold
- Email Body: text-base font-normal
- Metadata (time, sender): text-sm font-medium
- UI Labels: text-sm font-medium
- Email Address Display: text-xl font-mono
- Action Buttons: text-sm font-medium

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 3, 4, 6, and 8 consistently
- Component padding: p-4, p-6
- Section gaps: gap-4, gap-6
- Margins: m-2, m-4, m-6

**Container Structure:**
- App Container: max-w-7xl mx-auto with p-4 or p-6
- Email List: Flexible height with overflow-y-auto
- Preview Pane: min-h-screen or flexible based on content

**Grid Layout:**
Desktop: Two-column split (1/3 inbox list, 2/3 preview pane)
Tablet: Stacked or 1/2 split
Mobile: Single column, toggle between list and preview

---

## Core Components

### Header Section
- Email Address Display: Large monospace text with prominent copy button
- Generation Button: Primary action, positioned prominently
- Timer Display: Small badge showing countdown
- Layout: Flex row with justify-between alignment, p-6

### Inbox List (Sidebar)
- Individual Email Cards: Rounded corners (rounded-lg), p-4 spacing
- Unread Indicator: Small badge or border accent
- Card Structure:
  - Sender name: font-semibold
  - Subject: text-sm, truncated with ellipsis
  - Timestamp: text-xs, right-aligned
  - Preview snippet: text-sm, truncated, 2 lines max
- Hover state: Subtle background shift (implement via Tailwind hover:)
- Active/Selected state: Border accent or background emphasis

### Email Preview Pane
- Header section: p-6 with sender, subject, timestamp
- Body content: p-6, max-w-prose for readability
- HTML email: iframe or sanitized container with proper spacing
- Attachments section (future): Grid layout with file cards

### Action Buttons
- Copy Email Button: Icon + text, prominent positioning near email address
- Refresh Button: Icon only, top-right of inbox
- Delete/Clear: Icon or text button, subtle styling
- Button sizing: px-4 py-2 with rounded-lg
- When overlaying images: backdrop-blur-sm bg-white/90

### Empty States
- No Emails: Centered illustration/icon with text-center
- No Email Selected: Centered prompt in preview pane
- Loading States: Skeleton loaders matching email card structure

---

## Interaction Patterns

**Real-time Updates:**
- Subtle pulse animation on new email arrival
- Toast notification in top-right corner
- Auto-scroll to new emails

**Copy to Clipboard:**
- Click action with instant feedback
- Success toast: "Copied to clipboard" with checkmark icon
- Icon transition from copy to check

**Email Selection:**
- Click entire card to view
- Visual feedback on hover
- Clear selected state distinction

---

## Responsive Behavior

**Desktop (lg and up):**
- Two-column layout with fixed sidebar
- Sidebar width: w-96 or w-1/3
- Preview pane: flex-1

**Tablet (md):**
- Optional: Collapsible sidebar
- Reduce preview pane padding
- Stack if needed for better readability

**Mobile (base):**
- Single column, full-width cards
- Toggle between list and detail view
- Fixed header with email address
- Bottom navigation for actions

---

## RTL Support (Persian)
- Implement dir="rtl" on root container
- Reverse flex directions appropriately
- Right-align text for Persian content
- Mirror icon positions (chevrons, arrows)
- Use Tailwind's RTL modifiers (e.g., ltr:ml-4 rtl:mr-4)

---

## Icons
**Library:** Heroicons (via CDN)
- Copy: document-duplicate icon
- Refresh: arrow-path icon
- Email: envelope icon
- Timer: clock icon
- Delete: trash icon
- Checkmark: check icon

---

## Accessibility
- Focus states on all interactive elements (ring-2 ring-offset-2)
- Keyboard navigation for email list (arrow keys)
- ARIA labels for icon-only buttons
- Screen reader announcements for new emails
- Semantic HTML (nav, main, article for emails)
- Sufficient contrast ratios throughout
- Focus trap in modals if used

---

## Key Design Principles
1. **Clarity First:** Information hierarchy guides user attention
2. **Instant Feedback:** Every action has immediate visual response
3. **Efficient Scanning:** Email list optimized for quick scanning
4. **Trust & Professionalism:** Clean, reliable aesthetic builds confidence
5. **Minimal Distractions:** Focus on email content, not decorative elements

**Animation Policy:** Use sparingly - only for state transitions (new email pulse, copy confirmation). No continuous animations.