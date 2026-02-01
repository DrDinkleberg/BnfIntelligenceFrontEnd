"""
Patch api-client.ts:
1. Fix FDA endpoint: /fda/enforcements → /fda/recalls (matches OpenAPI spec)
2. Add getFDARecalls alias
3. Add getFDADeviceRecalls method
"""
import sys

filepath = "/home/mmendes/bnf-frontend/lib/api-client.ts"

with open(filepath, "r") as f:
    content = f.read()

# Fix 1: FDA endpoint path
content = content.replace(
    'return this.get("/fda/enforcements", params)',
    'return this.get("/fda/recalls", params)'
)

# Fix 2: Add FDA device recalls method if missing
if "getFDADeviceRecalls" not in content:
    content = content.replace(
        """  async getFDASummary() {
    return this.get("/fda/summary")
  }""",
        """  async getFDARecalls(params?: Record<string, any>) {
    return this.get("/fda/recalls", params)
  }

  async getFDADeviceRecalls(params?: Record<string, any>) {
    return this.get("/fda/device-recalls", params)
  }

  async getFDASummary() {
    return this.get("/fda/summary")
  }"""
    )

with open(filepath, "w") as f:
    f.write(content)

print("✅ api-client.ts patched — FDA endpoint fixed, device recalls method added")
