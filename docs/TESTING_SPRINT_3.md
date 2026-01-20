# Sprint 3: Quote Funnel Testing Guide

## ✅ Components Implemented

All Sprint 3 components have been successfully created:

1. **DateRangePicker** - Date range selection component
2. **QuoteForm** - Complete 4-section quote request form
3. **Quote Request Page** - `/cere-oferta` page with form
4. **Confirmation Page** - `/cere-oferta/confirmare` success page
5. **API Route** - `/api/quotes` for handling submissions
6. **Database Migration** - SQL migration for quotes table

## 🧪 Testing the Quote Funnel

### 1. Access the Quote Form

**URL:** `http://localhost:3100/ro/cere-oferta`

or click "Cere Ofertă" button in the header navigation.

### 2. Fill Out the Form

**Section 1: Despre Eveniment**
- Event Type: Select any option (Festival, Concert, Conference, etc.)
- Event Dates: Click to open calendar, select start and end dates
- Attendees: Drag slider between 100-12,000
- Location: Enter any location (e.g., "Cluj Arena, Cluj-Napoca")
- Description: Optional text

**Section 2: Servicii Necesare**
- Check at least one service (Garderobă standard, VIP, etc.)

**Section 3: Datele Tale** (Required)
- Name: Enter full name
- Email: Must be valid email format
- Phone: Enter phone number
- Company: Optional
- Role: Optional

**Section 4: Preferințe** (Optional)
- Budget Range: Select from dropdown
- Referral Source: Select how you heard about us

### 3. Submit the Form

Click "Trimite Cererea" button at the bottom.

**Expected Behavior:**
- Button shows loading state: "Se trimite..."
- Form data is sent to `/api/quotes` endpoint
- Database record is created in `quotes` table
- User is redirected to confirmation page

### 4. Confirmation Page

After successful submission, you should see:

- Green checkmark icon
- Success message: "Cererea Ta a Fost Primită!"
- User's email displayed
- 4-step timeline of what happens next
- Contact information cards (Email & Phone)
- CTAs to homepage and shop

## 🔧 Testing Scenarios

### ✅ Valid Submission

```
Event Type: Festival
Dates: Tomorrow to 3 days from now
Attendees: 5000
Location: Cluj Arena, Cluj-Napoca
Services: Garderobă standard, VIP
Name: Test User
Email: test@example.com
Phone: +40 123 456 789
```

**Expected:** Success, redirect to confirmation page

### ❌ Missing Required Fields

Try submitting without:
- Event type
- Date range
- Name
- Email
- Phone

**Expected:** Browser validation prevents submission

### ❌ Invalid Email Format

```
Email: notanemail
```

**Expected:** Browser validation shows error

### 🛡️ Spam Protection Test

Open browser console and try to fill the honeypot field:

```javascript
document.querySelector('[name="honeypot"]').value = 'spam'
```

Then submit the form.

**Expected:** 400 error, "Spam detected"

## 📊 Verify Database Entry

After successful submission, check Supabase database:

```sql
SELECT * FROM quotes ORDER BY created_at DESC LIMIT 1;
```

Should show:
- Unique `quote_number` (format: QT-2026-XXXXXX)
- All form fields properly mapped
- `status` = 'new'
- Correct boolean flags for services
- Timestamps set

## 🚨 Known Limitations

1. **Email Service Not Implemented**
   - Confirmation email to user: ❌ Not sent
   - Notification email to admin: ❌ Not sent
   - TO DO: Implement email service with nodemailer

2. **Database Migration**
   - Migration file created: ✅ `supabase/migrations/003_create_quotes_table.sql`
   - Migration applied: ⏳ May need to run manually
   - TO DO: Run migration if quotes table doesn't exist

3. **Validation**
   - Client-side validation: ✅ Working
   - Server-side validation: ✅ Basic checks
   - Advanced validation: ⏳ Could add more (phone format, date logic)

## 🐛 Troubleshooting

### Issue: "Failed to create quote" error

**Possible Causes:**
1. Quotes table doesn't exist in Supabase
2. RLS policies blocking insertion
3. Field mapping mismatch

**Solution:**
1. Run migration: `supabase db push` or apply SQL manually
2. Check Supabase dashboard → Authentication → Policies
3. Check browser console for detailed error

### Issue: Form doesn't submit

**Possible Causes:**
1. Required fields not filled
2. Invalid email/phone format
3. JavaScript error

**Solution:**
1. Fill all required fields (marked with *)
2. Check email has @ symbol
3. Open browser console, check for errors

### Issue: Date picker not working

**Possible Causes:**
1. Missing dependencies (date-fns, react-day-picker)
2. CSS not loaded

**Solution:**
```bash
npm install date-fns@3.0.0 react-day-picker@8.10.0
```

## 📝 API Testing

### POST /api/quotes

Test with curl:

```bash
curl -X POST http://localhost:3100/api/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "festival",
    "dateFrom": "2026-02-01T00:00:00.000Z",
    "dateTo": "2026-02-03T00:00:00.000Z",
    "attendees": 5000,
    "location": "Cluj Arena",
    "description": "Summer festival",
    "services": ["cloakroom", "vip"],
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+40123456789",
    "company": "Test Company",
    "budget": "10000-20000",
    "referral": "google",
    "honeypot": ""
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "quoteNumber": "QT-2026-123456",
  "message": "Quote created successfully"
}
```

### GET /api/quotes

List all quotes:

```bash
curl http://localhost:3100/api/quotes
```

**Expected Response:**
```json
{
  "quotes": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

Filter by status:

```bash
curl http://localhost:3100/api/quotes?status=new&page=1&limit=10
```

## ✅ Sprint 3 Completion Checklist

- [x] DateRangePicker component created
- [x] QuoteForm component with 4 sections
- [x] Quote request page at /cere-oferta
- [x] Confirmation page at /cere-oferta/confirmare
- [x] POST /api/quotes endpoint
- [x] GET /api/quotes endpoint (with pagination)
- [x] Database migration file
- [x] Spam protection (honeypot)
- [x] Client-side validation
- [x] Loading states
- [x] Error handling
- [x] Bilingual support (RO/EN)
- [x] Responsive design
- [ ] Email confirmation (TODO)
- [ ] Email notification to admin (TODO)
- [ ] Advanced form validation (TODO)
- [ ] Rate limiting (TODO)

## 🎯 Next Steps (Sprint 4-6)

After Sprint 3 is fully tested and working:

1. **Email Service** - Implement nodemailer integration
2. **Shop Functionality** - Product catalog, cart, checkout
3. **Admin Panel** - Quote management dashboard

---

**Last Updated:** January 2026  
**Status:** Sprint 3 - 85% Complete  
**Developer:** GitHub Copilot (Claude Sonnet 4.5)
