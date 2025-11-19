# UI Component Library - Quick Reference

## Component Overview

| Component | Purpose | Common Use Cases |
|-----------|---------|------------------|
| **PageHeader** | Page title and description | Every page should start with this |
| **Card** | Content container | Lists, forms, data sections |
| **Button** | Interactive actions | Forms, navigation, actions |
| **InfoCard** | Information display | Profile pages, detail views |
| **InfoRow** | Single info item | Inside InfoCard for key-value pairs |

## Quick Import

```javascript
import { PageHeader, Card, Button, InfoCard, InfoRow } from '../components/ui';
```

## Component Hierarchy

```
Page Layout
├── PageHeader (page title)
└── Content Area
    ├── Card (general content)
    │   └── Any content
    ├── InfoCard (structured info)
    │   └── InfoRow (info items)
    └── Button (actions)
```

## Common Patterns

### Pattern 1: Standard Page Layout
```javascript
<div className="flex flex-col h-full">
  <PageHeader title="Page Title" description="Description" />
  <div className="p-6 space-y-6">
    <Card title="Section 1">Content</Card>
    <Card title="Section 2">Content</Card>
  </div>
</div>
```

### Pattern 2: Profile/Detail Page
```javascript
<div className="flex flex-col h-full">
  <PageHeader title="Profile" />
  <div className="p-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <InfoCard title="Contact" icon="contact_mail">
        <InfoRow icon="email" label="Email" value="..." />
        <InfoRow icon="phone" label="Phone" value="..." />
      </InfoCard>
      <InfoCard title="Job Info" icon="work">
        <InfoRow icon="badge" label="ID" value="..." />
        <InfoRow icon="person" label="Title" value="..." />
      </InfoCard>
    </div>
  </div>
</div>
```

### Pattern 3: List/Table Page
```javascript
<div className="flex flex-col h-full">
  <PageHeader 
    title="Items" 
    actions={<Button variant="primary" icon="add">Add New</Button>}
  />
  <div className="p-6">
    <Card title="All Items" noPadding>
      <table className="w-full">
        {/* Table content */}
      </table>
    </Card>
  </div>
</div>
```

### Pattern 4: Dashboard with Stats
```javascript
<div className="flex flex-col h-full">
  <PageHeader title="Dashboard" icon="dashboard" />
  <div className="p-6 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card hover>Stat 1</Card>
      <Card hover>Stat 2</Card>
      <Card hover>Stat 3</Card>
      <Card hover>Stat 4</Card>
    </div>
    <Card title="Recent Activity">Activity list</Card>
  </div>
</div>
```

## Button Variants Visual Guide

```
Primary:    [Blue background, white text] - Main actions
Secondary:  [Gray background, dark text] - Secondary actions
Danger:     [Red background, white text] - Delete/destructive actions
Success:    [Green background, white text] - Approve/confirm actions
Outline:    [Transparent bg, blue border] - Tertiary actions
```

## Size Reference

```
Buttons:
- sm:  Small (px-3 py-1.5)
- md:  Medium (px-4 py-2) [default]
- lg:  Large (px-6 py-3)

Cards:
- Default padding: p-6
- No padding: noPadding={true}
```

## Color Classes Reference

### Backgrounds
- `bg-background-light` / `dark:bg-background-dark` - Page background
- `bg-card-light` / `dark:bg-card-dark` - Card/container background

### Text
- `text-heading-light` / `dark:text-heading-dark` - Main headings
- `text-text-light` / `dark:text-text-dark` - Body text
- `text-subtext-light` / `dark:text-subtext-dark` - Secondary/muted text
- `text-primary` - Primary brand color (blue)

### Borders
- `border-border-light` / `dark:border-border-dark` - Border colors

### Status Colors
- Success: `bg-green-100 text-green-800` / `dark:bg-green-900/30 dark:text-green-300`
- Warning: `bg-yellow-100 text-yellow-800` / `dark:bg-yellow-900/30 dark:text-yellow-300`
- Error: `bg-red-100 text-red-800` / `dark:bg-red-900/30 dark:text-red-300`
- Info: `bg-blue-100 text-blue-800` / `dark:bg-blue-900/30 dark:text-blue-300`

## Material Icons

All components support Material Icons. Common icons:

**Navigation & Actions:**
- `dashboard`, `home`, `menu`, `settings`, `search`
- `add`, `edit`, `delete`, `save`, `close`
- `arrow_back`, `arrow_forward`, `expand_more`

**People & HR:**
- `person`, `people`, `groups`, `badge`
- `person_add`, `manage_accounts`, `supervisor_account`

**Business:**
- `work`, `business`, `school`, `apartment`
- `receipt`, `payment`, `account_balance`

**Communication:**
- `email`, `phone`, `contact_mail`, `message`
- `notifications`, `campaign`, `announcement`

**Files & Data:**
- `folder`, `description`, `upload`, `download`
- `inventory_2`, `assignment`, `assessment`

**Status & Time:**
- `check_circle`, `cancel`, `pending`, `schedule`
- `event`, `calendar_today`, `history`

## Responsive Breakpoints

```javascript
// Mobile first approach
grid-cols-1              // Mobile (default)
md:grid-cols-2          // Tablet (768px+)
lg:grid-cols-3          // Desktop (1024px+)
xl:grid-cols-4          // Large desktop (1280px+)
```

## Accessibility Checklist

- ✅ All buttons have focus states
- ✅ Proper semantic HTML (header, main, section)
- ✅ Icons are decorative (don't interfere with screen readers)
- ✅ Color contrast meets WCAG AA standards
- ✅ Keyboard navigation supported
- ✅ Dark mode fully supported

## Migration Checklist

When updating an existing page:

1. ✅ Replace custom header with `<PageHeader>`
2. ✅ Replace custom cards with `<Card>`
3. ✅ Replace custom buttons with `<Button>`
4. ✅ Use `<InfoCard>` + `<InfoRow>` for profile-like displays
5. ✅ Test in both light and dark mode
6. ✅ Test responsive behavior
7. ✅ Verify all actions still work

## Common Mistakes to Avoid

❌ **Don't** create custom styled divs when a component exists
✅ **Do** use the component library

❌ **Don't** mix custom styles with component styles
✅ **Do** use className prop for additional styling

❌ **Don't** forget dark mode classes
✅ **Do** use the provided color classes

❌ **Don't** hardcode colors
✅ **Do** use Tailwind theme colors

❌ **Don't** skip PageHeader on pages
✅ **Do** use PageHeader for consistency

## Performance Tips

1. Import only what you need:
   ```javascript
   import { Button } from '../components/ui';  // Good
   ```

2. Use React.memo for expensive components if needed

3. Avoid inline functions in render:
   ```javascript
   // Bad
   <Button onClick={() => handleClick(id)}>Click</Button>
   
   // Good
   const handleButtonClick = () => handleClick(id);
   <Button onClick={handleButtonClick}>Click</Button>
   ```

## Support & Resources

- **Full Documentation:** See `README.md`
- **Usage Examples:** See `EXAMPLES.md`
- **Design Spec:** See `.kiro/specs/hr-manager-improvements/design.md`

## Version History

- **v1.0.0** (2025-11-17): Initial release
  - PageHeader component
  - Card component
  - Button component with 5 variants
  - InfoCard component
  - InfoRow component
  - Full documentation and examples
