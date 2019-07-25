module.exports = {
  'anchor-text': {
    'Term or Phrase': 2,
    'External Pages Linking': 32,
    'External Subdomains Linking': 64,
    'External Root Domains Linking': 128,
    'External MozRank Passed': 512
  },
  'links': {
    'Null': 0,
    'Anchor Text': 4,
    'Normalized & Anchor Text': 8
  },
  'url-metrics': {
    "Title": 1,
    "Canonical URL": 4,
    "Subdomain": 8,
    "Root Domain": 16,
    "External Equity Links": 32,
    "Subdomain External Links": 64,
    "Root Domain External Links": 128,
    "Equity Links": 256,
    "Subdomains Linking": 512,
    "Root Domains Linking": 1024,
    "Links" : 2048,
    "Subdomain, Subdomains Linking": 4096,
    "Root Domain, Root Domains Linking": 8192,

    "MozRank: URL": 16384,
    "MozRank: Subdomain": 32768,
    "MozRank: Root Domain": 65536,
    "MozTrust": 131072,
    "MozTrust: Subdomain": 262144,
    "MozTrust: Root Domain": 524288,
    "MozRank: External Equity": 1048576,
    "MozRank: Subdomain, External Equity": 2097152,
    "MozRank: Root Domain, External Equity": 4194304,
    "MozRank: Subdomain Combined": 8388608,
    "MozRank: Root Domain Combined": 16777216,

    "Subdomain Spam Score": 67108864,
    "HTTP Status Code": 536870912,
    "Links to Subdomain": 4294967296,
    "Links to Root Domain": 8589934592,
    "Root Domains Linking to Subdomain": 17179869184,
    "Page Authority": 34359738368,
    "Domain Authority": 68719476736,
    "External links": 549755813888,
    "External links to subdomain": 140737488355328,
    "External links to root domain": 2251799813685248,
    "Linking C Blocks": 36028797018963968,
    "Time last crawled": 144115188075855872
  },
  "deprecated": [
    "MozRank: URL",
    "MozRank: Subdomain",
    "MozTrust",
    "MozTrust: Subdomain",
    "MozTrust: Root Domain",
    "MozRank: External Equity",
    "MozRank: Subdomain, External Equity",
    "MozRank: Root Domain, External Equity",
    "MozRank: Subdomain Combined",
    "MozRank: Root Domain Combined"
  ]
}