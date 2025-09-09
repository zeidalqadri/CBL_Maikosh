#!/bin/bash

# CBL-MAIKOSH Python Environment Setup Script
# This script ensures Python 3.12 is active for GCP deployment compatibility

set -e

echo "🐍 Setting up Python environment for CBL-MAIKOSH deployment..."

# Check if pyenv is available
if command -v pyenv >/dev/null 2>&1; then
    echo "✅ pyenv found"
    
    # Initialize pyenv
    eval "$(pyenv init -)"
    export PATH="$HOME/.pyenv/shims:$PATH"
    
    # Check if Python 3.12.8 is available
    if pyenv versions --bare | grep -q "3.12.8"; then
        echo "✅ Python 3.12.8 is available"
        
        # Set local version to 3.12.8
        pyenv local 3.12.8
        echo "🔧 Set local Python version to 3.12.8"
        
        # Verify the version
        python_version=$(python3 --version)
        echo "🐍 Active Python version: $python_version"
        
        # Test gsutil compatibility
        if python3 -c "import sys; exit(0 if (3, 8) <= sys.version_info[:2] <= (3, 12) else 1)"; then
            echo "✅ Python version is compatible with gsutil"
        else
            echo "❌ Python version is not compatible with gsutil"
            exit 1
        fi
        
    else
        echo "❌ Python 3.12.8 is not installed"
        echo "💡 Install it with: pyenv install 3.12.8"
        exit 1
    fi
    
else
    echo "❌ pyenv is not available"
    echo "💡 Please install pyenv or manually switch to Python 3.8-3.12"
    exit 1
fi

echo "🎉 Python environment is ready for CBL-MAIKOSH deployment!"
echo "💡 You can now run: ./deploy-cbl-maikosh.sh"