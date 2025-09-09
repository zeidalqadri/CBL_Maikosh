#!/usr/bin/env python3
import os

# Module data mapping
modules = {
    2: {"title": "Rules & Player Positions", "theme": "rules", "prev": "Introduction to Coaching"},
    3: {"title": "Violations", "theme": "violations", "prev": "Rules & Player Positions"},
    4: {"title": "Fouls & Official Signals", "theme": "officiating", "prev": "Violations"},
    5: {"title": "Basic Skills - Passing", "theme": "skills", "prev": "Fouls & Official Signals"},
    6: {"title": "Basic Skills - Shooting", "theme": "shooting", "prev": "Basic Skills - Passing"},
    7: {"title": "Basic Skills - Rebounding", "theme": "rebounding", "prev": "Basic Skills - Shooting"},
    8: {"title": "Basic Skills - Dribbling", "theme": "dribbling", "prev": "Basic Skills - Rebounding"},
    9: {"title": "Defense Fundamentals", "theme": "defense", "prev": "Basic Skills - Dribbling"},
    10: {"title": "Offense Fundamentals", "theme": "offense", "prev": "Defense Fundamentals"},
    11: {"title": "Training Design & Planning", "theme": "training", "prev": "Offense Fundamentals"},
    12: {"title": "Risk Management & First Aid", "theme": "safety", "prev": "Training Design & Planning"}
}

for num, data in modules.items():
    filepath = f"src/pages/modules/m{num}.js"
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Fix function name
    content = content.replace('export default function Module1()', f'export default function Module{num}()')
    
    # Fix useProgress hook
    content = content.replace('useProgress(user?.sub, 1)', f'useProgress(user?.sub, {num})')
    
    # Fix module layout props
    content = content.replace(
        f'<ModuleLayout moduleNumber={{1}} moduleName="Introduction to Coaching" theme="leadership">',
        f'<ModuleLayout moduleNumber={{{num}}} moduleName="{data["title"]}" theme="{data["theme"]}">'
    )
    
    # Fix title and meta description
    content = content.replace(
        f'<title>Module {num}: Introduction to Coaching | CBL_maikosh</title>',
        f'<title>Module {num}: {data["title"]} | CBL_maikosh</title>'
    )
    content = content.replace(
        'content="Learn the fundamental roles, styles, and philosophies of effective basketball coaching."',
        f'content="Master {data["title"].lower()} - essential knowledge for basketball coaches."'
    )
    
    # Fix module overview text
    content = content.replace(
        f'Welcome to Module {num}: Introduction to Coaching! This foundational module will introduce you to the',
        f'Welcome to Module {num}: {data["title"]}! This module will teach you'
    )
    
    # Fix previous module navigation
    if num > 1:
        content = content.replace(
            '<p className="text-gray-400">None - This is the first module</p>',
            f'''<a 
              href="/modules/m{num-1}" 
              className="text-basketball-orange hover:text-basketball-orange font-medium inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              {data["prev"]}
            </a>'''
        )
    
    # Fix next module title and link
    if num < 12:
        next_title = modules[num + 1]["title"]
        content = content.replace(
            'Rules & Player Positions',
            next_title
        )
    else:
        # Module 12 is the last one
        content = content.replace(
            f'''<a 
            href="/modules/m13" 
            className="text-basketball-orange hover:text-basketball-orange font-medium inline-flex items-center"
          >
            Rules & Player Positions
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>''',
            '<p className="text-gray-400">None - This is the final module</p>'
        )
    
    # Write back the file
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"✅ Fixed Module {num}: {data['title']}")

print("\n✅ All modules fixed successfully!")