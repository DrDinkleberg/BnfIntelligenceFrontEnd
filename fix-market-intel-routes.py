#!/usr/bin/env python3
"""
Fix Market Intel Route Issues
==============================
1. SEC: /sec/filings → /sec-edgar/filings (correct backend path)
2. CFPB: Disable feed + summary queries (no backend routes exist yet)

Run: python3 fix-market-intel-routes.py
"""

import re
import sys
import os

FRONTEND_DIR = os.path.expanduser("~/bnf-frontend")

def fix_file(filepath, replacements, description):
    """Apply string replacements to a file."""
    full_path = os.path.join(FRONTEND_DIR, filepath)
    
    if not os.path.exists(full_path):
        print(f"  ✗ File not found: {full_path}")
        return False
    
    with open(full_path, 'r') as f:
        content = f.read()
    
    original = content
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            print(f"  ✓ Replaced: {old[:60]}...")
        else:
            print(f"  ⚠ Not found (may already be fixed): {old[:60]}...")
    
    if content != original:
        with open(full_path, 'w') as f:
            f.write(content)
        print(f"  ✓ {description} — saved")
        return True
    else:
        print(f"  — No changes needed for: {description}")
        return False


def fix_hooks():
    """Fix use-market-intel.ts: SEC path + disable CFPB queries."""
    print("\n[1/3] Fixing hooks/use-market-intel.ts...")
    
    filepath = "hooks/use-market-intel.ts"
    full_path = os.path.join(FRONTEND_DIR, filepath)
    
    if not os.path.exists(full_path):
        print(f"  ✗ File not found: {full_path}")
        return False
    
    with open(full_path, 'r') as f:
        content = f.read()
    
    original = content
    changes = 0
    
    # Fix 1: SEC path
    old_sec = '"/sec/filings"'
    new_sec = '"/sec-edgar/filings"'
    if old_sec in content:
        content = content.replace(old_sec, new_sec)
        print(f"  ✓ SEC: /sec/filings → /sec-edgar/filings")
        changes += 1
    else:
        print(f"  — SEC path already fixed or not found")
    
    # Fix 2: Disable CFPB feed query by commenting it out
    # We need to remove/comment the CFPB entry from buildSourceQueries
    cfpb_block = '''    {
      key: "cfpb",
      queryFn: () => apiClient.get("/cfpb/complaints", { per_page: 10 }),
      extractKey: ["complaints"],
      mapper: mapCFPBComplaint,
    },'''
    
    cfpb_replacement = '''    // CFPB disabled — no backend routes yet (re-enable when /api/v1/cfpb/* is deployed)
    // {
    //   key: "cfpb",
    //   queryFn: () => apiClient.get("/cfpb/complaints", { per_page: 10 }),
    //   extractKey: ["complaints"],
    //   mapper: mapCFPBComplaint,
    // },'''
    
    if cfpb_block in content:
        content = content.replace(cfpb_block, cfpb_replacement)
        print(f"  ✓ CFPB: Disabled feed query (no backend routes)")
        changes += 1
    else:
        print(f"  — CFPB feed query block not found (may already be disabled)")
    
    # Fix 3: Disable CFPB summary query
    cfpb_summary = '''  const cfpb = useQuery({
    queryKey: ["market-intel", "summary", "cfpb"],
    queryFn: () => apiClient.get("/cfpb/summary") as Promise<any>,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })'''
    
    cfpb_summary_replacement = '''  // CFPB summary disabled — no backend routes yet
  const cfpb = {
    data: null,
    isLoading: false,
  } as { data: any; isLoading: boolean }'''
    
    if cfpb_summary in content:
        content = content.replace(cfpb_summary, cfpb_summary_replacement)
        print(f"  ✓ CFPB: Disabled summary query (stub returns null)")
        changes += 1
    else:
        print(f"  — CFPB summary query block not found (may already be disabled)")
    
    if content != original:
        with open(full_path, 'w') as f:
            f.write(content)
        print(f"  ✓ Saved ({changes} changes)")
        return True
    else:
        print(f"  — No changes needed")
        return False


def fix_types():
    """Update types/market-intel.ts: move CFPB to noted as disabled."""
    print("\n[2/3] Fixing types/market-intel.ts...")
    
    filepath = "types/market-intel.ts"
    full_path = os.path.join(FRONTEND_DIR, filepath)
    
    if not os.path.exists(full_path):
        print(f"  ✗ File not found: {full_path}")
        return False
    
    with open(full_path, 'r') as f:
        content = f.read()
    
    original = content
    
    # Remove CFPB from ACTIVE_SOURCES
    old_cfpb_source = '  { key: "cfpb", label: "CFPB", type: "regulatory", active: true },'
    new_cfpb_source = '  // { key: "cfpb", label: "CFPB", type: "regulatory", active: true },  // Disabled — no backend routes yet'
    
    if old_cfpb_source in content:
        content = content.replace(old_cfpb_source, new_cfpb_source)
        print(f"  ✓ CFPB removed from ACTIVE_SOURCES")
    
    if content != original:
        with open(full_path, 'w') as f:
            f.write(content)
        print(f"  ✓ Saved")
        return True
    else:
        print(f"  — No changes needed")
        return False


def fix_component():
    """Update components/market-intel.tsx: CFPB summary card shows 'Pending'."""
    print("\n[3/3] Fixing components/market-intel.tsx...")
    
    filepath = "components/market-intel.tsx"
    full_path = os.path.join(FRONTEND_DIR, filepath)
    
    if not os.path.exists(full_path):
        print(f"  ✗ File not found: {full_path}")
        return False
    
    with open(full_path, 'r') as f:
        content = f.read()
    
    original = content
    
    # Update the CFPB summary card to show "Pending" instead of loading "—" 
    old_cfpb_card = '''    {
      label: "CFPB",
      icon: Shield,
      color: "text-blue-500",
      stat: summaries.cfpb?.complaints_last_7_days ?? "—",
      sub: summaries.cfpb?.top_company
        ? `Top: ${summaries.cfpb.top_company}`
        : `${summaries.cfpb?.total_complaints?.toLocaleString() ?? "—"} total`,
    },'''
    
    new_cfpb_card = '''    {
      label: "CFPB",
      icon: Shield,
      color: "text-blue-500",
      stat: summaries.cfpb?.complaints_last_7_days ?? "—",
      sub: summaries.cfpb?.top_company
        ? `Top: ${summaries.cfpb.top_company}`
        : summaries.cfpb ? `${summaries.cfpb?.total_complaints?.toLocaleString() ?? "—"} total` : "API coming soon",
    },'''
    
    if old_cfpb_card in content:
        content = content.replace(old_cfpb_card, new_cfpb_card)
        print(f"  ✓ CFPB summary card shows 'API coming soon' when no data")
    else:
        print(f"  — CFPB card block not found (may differ)")
    
    if content != original:
        with open(full_path, 'w') as f:
            f.write(content)
        print(f"  ✓ Saved")
        return True
    else:
        print(f"  — No changes needed")
        return False


def main():
    print("=" * 60)
    print("Market Intel Route Fixes")
    print("=" * 60)
    print(f"Frontend dir: {FRONTEND_DIR}")
    
    # Verify directory exists
    if not os.path.isdir(FRONTEND_DIR):
        print(f"\n✗ Directory not found: {FRONTEND_DIR}")
        sys.exit(1)
    
    results = []
    results.append(("Hooks (SEC + CFPB)", fix_hooks()))
    results.append(("Types (CFPB)", fix_types()))
    results.append(("Component (CFPB card)", fix_component()))
    
    print("\n" + "=" * 60)
    print("Summary")
    print("=" * 60)
    for name, changed in results:
        status = "✓ Fixed" if changed else "— No changes"
        print(f"  {status}: {name}")
    
    any_changed = any(r[1] for r in results)
    if any_changed:
        print(f"\n→ Next: Run 'npm run build && pm2 restart all'")
    else:
        print(f"\n→ No changes applied.")
    
    print(f"\n⚠ Backend issues still pending:")
    print(f"  1. CFPB: Need to register /api/v1/cfpb/* routes in FastAPI")
    print(f"  2. NHTSA: Fix 'NHTSAComplaint.first_seen_at' in summary endpoint")


if __name__ == "__main__":
    main()
