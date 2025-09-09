#!/bin/bash

# Script to apply alloui brand updates to all module pages
# This script updates the key brand elements in all 12 modules

echo "Starting alloui brand update for all modules..."

# Module names mapping
declare -A module_names=(
    [1]="INTRODUCTION TO COACHING"
    [2]="RULES & PLAYER POSITIONS"
    [3]="VIOLATIONS"
    [4]="FOULS & OFFICIAL SIGNALS"
    [5]="BASIC SKILLS - PASSING"
    [6]="BASIC SKILLS - SHOOTING"
    [7]="BALL CONTROL & DRIBBLING"
    [8]="REBOUNDING & POSITIONING"
    [9]="OFFENSIVE STRATEGIES"
    [10]="DEFENSIVE STRATEGIES"
    [11]="TRAINING DESIGN & PLANNING"
    [12]="RISK MANAGEMENT & FIRST AID"
)

# Update each module
for i in {2..12}; do
    echo "Updating module m${i}..."
    
    # Replace key patterns using sed
    sed -i '' "s/| CBL_alloui/| alloui by CBL/g" /Users/zeidalqadri/Desktop/ConsurvBL/alouiy/src/pages/modules/m${i}.js
    sed -i '' "s/border-whistle-silver/border-gray-200 dark:border-gray-700/g" /Users/zeidalqadri/Desktop/ConsurvBL/alouiy/src/pages/modules/m${i}.js
    sed -i '' "s/text-court-blue/text-gray-900 dark:text-white/g" /Users/zeidalqladri/Desktop/ConsurvBL/alouiy/src/pages/modules/m${i}.js
    sed -i '' "s/text-gray-700/text-gray-600 dark:text-gray-300/g" /Users/zeidalqladri/Desktop/ConsurvBL/alouiy/src/pages/modules/m${i}.js
    sed -i '' "s/bg-white rounded-lg shadow-md/brand-card/g" /Users/zeidalqladri/Desktop/ConsurvBL/alouiy/src/pages/modules/m${i}.js
    sed -i '' "s/text-neutral-gray/text-gray-600 dark:text-gray-400/g" /Users/zeidalqladri/Desktop/ConsurvBL/alouiy/src/pages/modules/m${i}.js
    
done

echo "Basic updates completed. Manual fine-tuning needed for each module."