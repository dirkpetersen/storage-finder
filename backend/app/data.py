"""Reference data for the storage finder: data classification levels and the
catalog of storage services available at the university."""

CLASSIFICATIONS = {
    "unrestricted": {
        "label": "Unrestricted",
        "summary": "Data intended for general use within the university.",
        "examples": [
            "Directory information",
            "Website pages",
            "Syllabi",
            "Schedule of classes",
        ],
    },
    "sensitive": {
        "label": "Sensitive",
        "summary": (
            "Data commonly used to conduct university business that, by its nature or "
            "regulation, carries an expected obligation of non-disclosure outside of "
            "authorized individuals."
        ),
        "examples": [
            "Data protected under FERPA",
            "Employment applications",
            "Employee performance evaluations",
            "Confidential donor information",
            "IRB Level 2 human subjects research data",
            "Minutes from confidential meetings",
            "Misconduct accusations / investigation records",
            "Date of birth, place of birth, mother's maiden name",
            "Personally identifiable demographic information",
            "Admissions applications",
            "Privileged attorney-client communications",
            "ID photos",
        ],
    },
    "confidential": {
        "label": "Confidential",
        "summary": (
            "The most restrictive classification. Data that could cause serious harm to "
            "the university or individuals if disclosed to those lacking authorized access."
        ),
        "examples": [
            "Social Security Number",
            "Driver's license / state-issued ID number",
            "Visa / passport number",
            "Credit card or bank account number",
            "Health insurance policy number",
            "Income tax records",
            "Personally identifiable health or genetic information",
            "Classified research data",
            "Controlled Unclassified Information (CUI)",
            "IRB Level 3 human subjects research data",
            "Export-controlled / ITAR research data",
        ],
    },
}

# classification_status values:
#   ok      -> fully permitted
#   review  -> permitted but requires review/approval, or "check with your IT support"
#   no      -> never store this classification of data here

STORAGE_OPTIONS = [
    {
        "id": "box",
        "name": "Box",
        "short_name": "Box",
        "vendor": "Box",
        "category": "Cloud file sharing",
        "tagline": "Cloud file storage and sharing for individuals and groups.",
        "description": (
            "A cloud storage and collaboration platform accessible from any browser or "
            "desktop/mobile app, with easy external sharing links."
        ),
        "cost": "Free (institutionally licensed)",
        "capacity_label": "Generous individual quota, pooled group folders",
        "backup_available": True,
        "backup_note": "Versioned automatically; deleted files are recoverable for a limited time.",
        "department_restricted": None,
        "classification_status": {
            "unrestricted": "ok",
            "sensitive": "ok",
            "confidential": "review",
        },
        "audiences": ["individual", "team", "external"],
        "volumes": ["small", "medium", "large"],
        "purposes": ["everyday"],
        "pros": ["Easy external sharing", "Works well for collaboration", "Available anywhere"],
        "cons": ["Confidential data needs security review first", "Not built for HPC workloads"],
        "accent": "#0061D5",
    },
    {
        "id": "onedrive",
        "name": "Microsoft OneDrive",
        "short_name": "OneDrive",
        "vendor": "Microsoft",
        "category": "Cloud file sharing",
        "tagline": "Personal cloud drive integrated with Microsoft 365.",
        "description": (
            "Your personal cloud drive, synced across devices and tightly integrated with "
            "Word, Excel, PowerPoint, and Teams."
        ),
        "cost": "Free (included with Microsoft 365)",
        "capacity_label": "Institution-defined quota (typically 1 TB)",
        "backup_available": True,
        "backup_note": "File versioning and a recoverable recycle bin are built in.",
        "department_restricted": None,
        "classification_status": {
            "unrestricted": "ok",
            "sensitive": "ok",
            "confidential": "ok",
        },
        "audiences": ["individual", "team"],
        "volumes": ["small", "medium"],
        "purposes": ["everyday"],
        "pros": ["Approved for all classification levels", "Deep Office integration", "Simple sync client"],
        "cons": ["Not designed for large research datasets", "Limited external sharing controls"],
        "accent": "#0078D4",
    },
    {
        "id": "sharepoint",
        "name": "Microsoft SharePoint",
        "short_name": "SharePoint",
        "vendor": "Microsoft",
        "category": "Cloud file sharing",
        "tagline": "Team and project sites for group collaboration.",
        "description": (
            "A shared team site with document libraries, permissions, and workflows for a "
            "group, project, or department — including guest access for external partners."
        ),
        "cost": "Free (included with Microsoft 365)",
        "capacity_label": "Large pooled quota (100 GB+ per site)",
        "backup_available": True,
        "backup_note": "File versioning and a recoverable recycle bin are built in.",
        "department_restricted": None,
        "classification_status": {
            "unrestricted": "ok",
            "sensitive": "ok",
            "confidential": "ok",
        },
        "audiences": ["team", "external"],
        "volumes": ["small", "medium", "large"],
        "purposes": ["everyday"],
        "pros": ["Approved for all classification levels", "Great for team/project collaboration", "Guest access with permission controls"],
        "cons": ["Overkill for a single individual's files", "Site structure takes some setup"],
        "accent": "#038387",
    },
    {
        "id": "tier1",
        "name": "Tier 1 Research Storage",
        "short_name": "Tier 1",
        "vendor": "Vast",
        "category": "University-managed research storage",
        "tagline": "High-performance, all-flash storage for active research computing.",
        "description": (
            "The fastest storage tier, built on all-flash hardware and attached to "
            "high-performance computing resources for workloads that need low latency "
            "and high throughput."
        ),
        "cost": "Paid, billed per TB",
        "capacity_label": "Scalable from TB to PB",
        "backup_available": True,
        "backup_note": "Snapshot-based recovery; ask your research computing team about full backup add-ons.",
        "department_restricted": None,
        "classification_status": {
            "unrestricted": "ok",
            "sensitive": "ok",
            "confidential": "review",
        },
        "audiences": ["individual", "team"],
        "volumes": ["medium", "large", "xlarge"],
        "purposes": ["hpc"],
        "pros": ["Lowest latency / highest throughput", "Directly attached to compute clusters", "Scales to large datasets"],
        "cons": ["Highest cost per TB", "Confidential data needs IT review first"],
        "accent": "#D73F09",
    },
    {
        "id": "tier2",
        "name": "Tier 2 Research Storage",
        "short_name": "Tier 2",
        "vendor": "PowerScale",
        "category": "University-managed research storage",
        "tagline": "Standard-performance storage for departments and research groups.",
        "description": (
            "General-purpose, standard-performance network storage for departmental "
            "shares and everyday research data that doesn't need all-flash speed."
        ),
        "cost": "Paid, billed per TB (lower than Tier 1)",
        "capacity_label": "Scalable from TB to PB",
        "backup_available": True,
        "backup_note": "Nightly backups included.",
        "department_restricted": None,
        "classification_status": {
            "unrestricted": "ok",
            "sensitive": "ok",
            "confidential": "review",
        },
        "audiences": ["individual", "team"],
        "volumes": ["medium", "large", "xlarge"],
        "purposes": ["hpc", "everyday"],
        "pros": ["Good balance of cost and performance", "Nightly backups included", "Good default for departmental shares"],
        "cons": ["Slower than Tier 1 for demanding compute jobs", "Confidential data needs IT review first"],
        "accent": "#EA6A20",
    },
    {
        "id": "tier3",
        "name": "Tier 3 Research Storage",
        "short_name": "Tier 3",
        "vendor": "Ceph",
        "category": "University-managed research storage",
        "tagline": "Lower-cost, higher-capacity storage for archival and bulk data.",
        "description": (
            "Object/bulk storage optimized for cost-per-TB rather than speed — a strong "
            "fit for large datasets that are written once and read infrequently."
        ),
        "cost": "Paid, lowest cost per TB",
        "capacity_label": "Scalable to multiple PB",
        "backup_available": False,
        "backup_note": "Data redundancy via erasure coding, not a traditional backup — keep a second copy of anything irreplaceable.",
        "department_restricted": None,
        "classification_status": {
            "unrestricted": "ok",
            "sensitive": "ok",
            "confidential": "review",
        },
        "audiences": ["individual", "team"],
        "volumes": ["large", "xlarge"],
        "purposes": ["archive"],
        "pros": ["Lowest cost per TB", "Scales to very large datasets", "Good backup/archive target"],
        "cons": ["Higher latency, not for active compute", "Not a substitute for real backup", "Confidential data needs IT review first"],
        "accent": "#4A4A48",
    },
    {
        "id": "eng_home",
        "name": "Engineering Home Directory",
        "short_name": "Home Directory",
        "vendor": "—",
        "category": "College of Engineering storage",
        "tagline": "Your personal network drive on every engineering lab computer.",
        "description": (
            "An individual network home directory available on all College of "
            "Engineering lab computers and, via VPN, personal devices. Commonly used "
            "for software builds and Linux configuration files."
        ),
        "cost": "Free",
        "capacity_label": "15 GB per person",
        "backup_available": True,
        "backup_note": "Backed up hourly.",
        "department_restricted": "engineering",
        "classification_status": {
            "unrestricted": "ok",
            "sensitive": "ok",
            "confidential": "review",
        },
        "audiences": ["individual"],
        "volumes": ["small"],
        "purposes": ["everyday"],
        "pros": ["Hourly backups", "Available on every lab machine", "Good for dotfiles and small personal files"],
        "cons": ["Small 15 GB quota", "Individual use only"],
        "accent": "#1E7C3B",
    },
    {
        "id": "eng_project",
        "name": "Engineering Project Space",
        "short_name": "Project Space",
        "vendor": "—",
        "category": "College of Engineering storage",
        "tagline": "Shared, backed-up storage for a project or research group.",
        "description": (
            "Network-wide shared disk space for a project or group, sized to the team's "
            "needs, with regular backups included."
        ),
        "cost": "Free",
        "capacity_label": "25 GB to 5 TB",
        "backup_available": True,
        "backup_note": "Backed up regularly.",
        "department_restricted": "engineering",
        "classification_status": {
            "unrestricted": "ok",
            "sensitive": "ok",
            "confidential": "review",
        },
        "audiences": ["individual", "team"],
        "volumes": ["small", "medium", "large"],
        "purposes": ["everyday"],
        "pros": ["Backed up automatically", "Sized to fit your project", "Supports software compilation"],
        "cons": ["Engineering department only", "Not tuned for HPC-scale throughput"],
        "accent": "#1E7C3B",
    },
    {
        "id": "eng_archive",
        "name": "Engineering Archival Storage",
        "short_name": "Archival (\"Attic\")",
        "vendor": "—",
        "category": "College of Engineering storage",
        "tagline": "Long-term, low-cost storage for data you rarely touch.",
        "description": (
            "Slower archival space for project data that has to be retained but is no "
            "longer actively used. Not backed up — treat it as the archive copy itself."
        ),
        "cost": "Free",
        "capacity_label": "25 GB to 5 TB",
        "backup_available": False,
        "backup_note": "No backups — this is long-term archival storage, not a working copy.",
        "department_restricted": "engineering",
        "classification_status": {
            "unrestricted": "ok",
            "sensitive": "ok",
            "confidential": "review",
        },
        "audiences": ["individual", "team"],
        "volumes": ["small", "medium", "large"],
        "purposes": ["archive"],
        "pros": ["Free long-term archive", "Good for closed-out project data"],
        "cons": ["No backup — slower to retrieve", "Engineering department only"],
        "accent": "#1E7C3B",
    },
    {
        "id": "cloud_paid",
        "name": "AWS / Azure Cloud Storage",
        "short_name": "Cloud Storage",
        "vendor": "AWS / Azure",
        "category": "Purchasable cloud storage",
        "tagline": "Pay-as-you-go cloud storage via the university's cloud contracts.",
        "description": (
            "Storage purchased directly through the university's AWS or Microsoft Azure "
            "contracts, for large-scale or specialized needs that don't fit the standard "
            "tiers — e.g. web app backends, elastic scaling, or specialized services."
        ),
        "cost": "Paid, pay-as-you-go",
        "capacity_label": "Elastic — scales to any size",
        "backup_available": True,
        "backup_note": "Depends entirely on how you configure it — backup is your responsibility.",
        "department_restricted": None,
        "classification_status": {
            "unrestricted": "ok",
            "sensitive": "review",
            "confidential": "review",
        },
        "audiences": ["individual", "team", "external"],
        "volumes": ["small", "medium", "large", "xlarge"],
        "purposes": ["everyday", "hpc", "archive"],
        "pros": ["Extremely flexible and scalable", "Good for specialized or elastic workloads"],
        "cons": ["Requires review/approval for sensitive or confidential data", "You configure and pay for everything, including backup"],
        "accent": "#232F3E",
    },
    {
        "id": "local_drive",
        "name": "Local Computer Hard Drive",
        "short_name": "Local Drive",
        "vendor": "—",
        "category": "Not recommended for permanent storage",
        "tagline": "The disk inside your own PC or laptop.",
        "description": (
            "Storage local to a single PC, laptop, or server. Convenient for temporary "
            "files, but there is no institutional backup or recovery if the device is "
            "lost, stolen, or fails."
        ),
        "cost": "None",
        "capacity_label": "Whatever your device has free",
        "backup_available": False,
        "backup_note": "No backup — you are entirely on your own if the device fails.",
        "department_restricted": None,
        "classification_status": {
            "unrestricted": "ok",
            "sensitive": "no",
            "confidential": "no",
        },
        "audiences": ["individual"],
        "volumes": ["small", "medium"],
        "purposes": ["everyday"],
        "pros": ["Always available, no setup"],
        "cons": ["No backup or recovery", "Never use for sensitive or confidential data", "Not meant for permanent storage"],
        "accent": "#8A8A8A",
    },
]
