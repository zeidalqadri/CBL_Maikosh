#!/bin/bash

# Cloud Build Context Validation Script
# Validates that the build context size is reasonable before deployment

set -e

echo "=== Cloud Build Context Validation ==="

# Function to check context size using gcloudignore simulation
validate_gcloudignore_context() {
    echo "Testing .gcloudignore effectiveness..."
    
    # Create temporary directory for testing
    TEMP_DIR=$(mktemp -d)
    
    # Copy files that would be uploaded by gcloud, respecting .gcloudignore
    if [ -f .gcloudignore ]; then
        echo "Using .gcloudignore to filter files..."
        rsync -av --exclude-from=.gcloudignore . "$TEMP_DIR/" 2>/dev/null
    else
        echo "No .gcloudignore found, copying all files..."
        rsync -av . "$TEMP_DIR/" 2>/dev/null
    fi
    
    # Calculate size and file count
    CONTEXT_SIZE=$(du -sh "$TEMP_DIR" | cut -f1)
    FILE_COUNT=$(find "$TEMP_DIR" -type f | wc -l)
    
    echo "Estimated Cloud Build context size: $CONTEXT_SIZE"
    echo "Estimated file count: $FILE_COUNT"
    
    # Show largest directories
    echo ""
    echo "Largest directories in context:"
    du -h "$TEMP_DIR"/* 2>/dev/null | sort -hr | head -10
    
    # Clean up
    rm -rf "$TEMP_DIR"
    
    # Validate thresholds
    SIZE_MB=$(echo "$CONTEXT_SIZE" | sed 's/[^0-9.]//g')
    MAX_SIZE_MB=10
    MAX_FILES=1000
    
    if (( $(echo "$FILE_COUNT > $MAX_FILES" | bc -l) )); then
        echo "❌ FAIL: Context has $FILE_COUNT files, maximum should be $MAX_FILES"
        return 1
    fi
    
    if (( $(echo "$SIZE_MB > $MAX_SIZE_MB" | bc -l) )); then
        echo "❌ FAIL: Context size is ${SIZE_MB}MB, maximum should be ${MAX_SIZE_MB}MB"
        return 1
    fi
    
    echo "✅ PASS: Context size and file count are within acceptable limits"
    return 0
}

# Function to validate Docker context (what Docker would send)
validate_docker_context() {
    echo ""
    echo "Testing Docker context size..."
    
    TEMP_DIR=$(mktemp -d)
    
    # Copy files that would be sent to Docker daemon, respecting .dockerignore
    if [ -f .dockerignore ]; then
        rsync -av --exclude-from=.dockerignore . "$TEMP_DIR/" 2>/dev/null
    else
        rsync -av . "$TEMP_DIR/" 2>/dev/null
    fi
    
    DOCKER_SIZE=$(du -sh "$TEMP_DIR" | cut -f1)
    DOCKER_FILES=$(find "$TEMP_DIR" -type f | wc -l)
    
    echo "Docker context size: $DOCKER_SIZE"
    echo "Docker context files: $DOCKER_FILES"
    
    rm -rf "$TEMP_DIR"
}

# Function to show file patterns that might be problematic
show_potential_issues() {
    echo ""
    echo "=== Potential Issues Analysis ==="
    
    echo "Large files in project (>1MB):"
    find . -type f -size +1M -not -path './node_modules/*' -not -path './.next/*' -not -path './.git/*' 2>/dev/null | head -10
    
    echo ""
    echo "Directories that should be ignored:"
    for dir in node_modules .next .git docs scripts terraform monitoring .claude .github; do
        if [ -d "$dir" ]; then
            SIZE=$(du -sh "$dir" 2>/dev/null | cut -f1)
            echo "$dir: $SIZE"
        fi
    done
}

# Function to recommend fixes
recommend_fixes() {
    echo ""
    echo "=== Recommendations ==="
    
    if [ ! -f .gcloudignore ]; then
        echo "1. Create .gcloudignore file to control what Cloud Build uploads"
    fi
    
    if [ -d node_modules ]; then
        echo "2. Ensure node_modules/ is in .gcloudignore"
    fi
    
    if [ -d .next ]; then
        echo "3. Ensure .next/ is in .gcloudignore"
    fi
    
    if [ -d docs ] || [ -d scripts ] || [ -d terraform ] || [ -d monitoring ]; then
        echo "4. Add development directories (docs/, scripts/, terraform/, monitoring/) to .gcloudignore"
    fi
    
    echo "5. Consider using cloudbuild-optimized.yaml which creates a minimal build context"
    echo "6. Use this script in CI/CD pipeline to fail builds if context is too large"
}

# Main execution
echo "Starting validation..."
echo "Project directory: $(pwd)"
echo "Total project size: $(du -sh . | cut -f1)"
echo ""

# Run validations
GCLOUD_RESULT=0
validate_gcloudignore_context || GCLOUD_RESULT=1

validate_docker_context
show_potential_issues
recommend_fixes

echo ""
echo "=== Validation Summary ==="
if [ $GCLOUD_RESULT -eq 0 ]; then
    echo "✅ Cloud Build context validation PASSED"
    exit 0
else
    echo "❌ Cloud Build context validation FAILED"
    echo "Fix the issues above before deploying to Cloud Build"
    exit 1
fi