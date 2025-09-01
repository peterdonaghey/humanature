# Domain Registration Activity Log

## quintadoamanha.org Registration - September 1, 2025

### Summary

Successfully initiated registration of `quintadoamanha.org` through AWS Route53 Domains service.

### Variables Used

```bash
domain="quintadoamanha.org"
profile="peterdonaghey"
region="us-east-1"
```

### Step-by-Step Process

#### 1. Domain Availability Check ✅

```bash
aws route53domains check-domain-availability \
  --domain-name "quintadoamanha.org" \
  --region "us-east-1" \
  --profile "peterdonaghey" \
  --no-cli-pager \
  --output json
```

**Result**: `AVAILABLE`

#### 2. Pricing Check ✅

```bash
aws route53domains list-prices \
  --tld "org" \
  --region "us-east-1" \
  --profile "peterdonaghey" \
  --no-cli-pager \
  --output json
```

**Result**: $15.00 USD for registration, transfer, and renewal

#### 3. Contact Information Setup ✅

Created `contact.json` with corrected format:

```json
{
  "FirstName": "Peter",
  "LastName": "Donaghey",
  "ContactType": "PERSON",
  "AddressLine1": "Rua da capela 21",
  "City": "Coutada",
  "CountryCode": "PT",
  "ZipCode": "6000-000",
  "PhoneNumber": "+44.7591147252",
  "Email": "donagheypeter@googlemail.com"
}
```

**Note**: Initial attempt failed due to:

- Incorrect phone format (needed dots: `+44.7591147252` instead of `+447591147252`)
- Portugal doesn't require "State" field

#### 4. Domain Registration ✅

```bash
aws route53domains register-domain \
  --domain-name "quintadoamanha.org" \
  --duration-in-years 1 \
  --auto-renew \
  --admin-contact file://contact.json \
  --registrant-contact file://contact.json \
  --tech-contact file://contact.json \
  --privacy-protect-admin-contact \
  --privacy-protect-registrant-contact \
  --privacy-protect-tech-contact \
  --region "us-east-1" \
  --profile "peterdonaghey" \
  --no-cli-pager \
  --output json
```

**Operation ID**: `c8c9099f-9908-4794-9aca-1562232d055c`
**Status**: SUCCESSFUL ✅
**Submitted**: 2025-09-01T16:49:12.108000+01:00
**Completed**: 2025-09-01T16:59:44.088000+01:00

#### 5. Current Domain Portfolio

- `peterdonaghey.com` (expires 2026-09-28)
- `sunturtle.life` (expires 2026-03-29)
- `quintadoamanha.org` (registration complete ✅)

## DNS Configuration for Vercel - September 1, 2025

### Vercel Requirements Met ✅

- **A Record**: @ pointing to 216.150.1.1 ✅
- **Nameservers**: Updated to Vercel DNS ✅

### DNS Setup Process

#### 1. Hosted Zone Creation ✅

AWS automatically created hosted zone when domain was registered:

- **Hosted Zone ID**: Z045610110F8THOBT4NVD
- **Initial Nameservers**: AWS Route53 nameservers

#### 2. A Record Creation ✅

```bash
# Created A record changeset
aws route53 change-resource-record-sets \
  --hosted-zone-id "Z045610110F8THOBT4NVD" \
  --change-batch file://a-record-changeset.json \
  --profile "peterdonaghey" \
  --no-cli-pager \
  --output json
```

**Change ID**: C0752222QXK3JVJK1FW8
**Status**: INSYNC (fully propagated)
**Record Details**:

- Name: quintadoamanha.org
- Type: A
- TTL: 300
- Value: 216.150.1.1

#### 3. Nameserver Update ✅

```bash
# Updated domain nameservers to Vercel DNS
aws route53domains update-domain-nameservers \
  --domain-name "quintadoamanha.org" \
  --nameservers file://vercel-nameservers.json \
  --region "us-east-1" \
  --profile "peterdonaghey" \
  --no-cli-pager \
  --output json
```

**Operation ID**: 12ee9a42-be40-4f9e-bfab-e994d4af0995
**Status**: IN_PROGRESS
**New Nameservers**:

- ns1.vercel-dns.com
- ns2.vercel-dns.com

### Vercel Integration Status

🎉 **Domain is now configured for Vercel!**

- ✅ A record created and propagated
- ✅ Nameservers updated to Vercel DNS
- ⏳ Nameserver propagation in progress (typically 24-48 hours)

### Important Notes

- **DNS Transition**: Since nameservers were changed to Vercel, all future DNS management should be done through Vercel's dashboard
- **Route53 A Record**: The A record we created in Route53 will become inactive once nameserver changes propagate (Vercel will manage DNS)
- **Propagation Time**: Full DNS propagation can take 24-48 hours globally

### Next Steps for Vercel Integration ✅ COMPLETED

✅ Domain registration completed  
✅ Hosted zone created in Route53  
✅ A record configured pointing to Vercel's IP (216.150.1.1)  
✅ Nameservers updated to Vercel DNS

### Final Steps (Manual)

1. Wait 24-48 hours for nameserver propagation to complete globally
2. Verify domain in Vercel dashboard
3. Configure any additional DNS records (CNAME for www, etc.) through Vercel's interface

### Useful Commands for Future Reference

**Check registration status:**

```bash
aws route53domains get-operation-detail \
  --operation-id "c8c9099f-9908-4794-9aca-1562232d055c" \
  --region "us-east-1" \
  --profile "peterdonaghey" \
  --no-cli-pager \
  --output json
```

**Get domain details once registered:**

```bash
aws route53domains get-domain-detail \
  --domain-name "quintadoamanha.org" \
  --region "us-east-1" \
  --profile "peterdonaghey" \
  --no-cli-pager \
  --output json
```

**List all domains:**

```bash
aws route53domains list-domains \
  --region "us-east-1" \
  --profile "peterdonaghey" \
  --no-cli-pager \
  --output json
```

### Cost Summary

- Registration fee: $15.00 USD
- Auto-renewal enabled for continuous registration
- Privacy protection enabled for all contact types
- No additional DNS charges (managed by Vercel)
