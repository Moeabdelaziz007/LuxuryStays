#!/bin/bash

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
  echo "Firebase CLI is not installed. Installing now..."
  npm install -g firebase-tools
fi

# Check if the user is logged in to Firebase
firebase login:list &> /dev/null
if [ $? -ne 0 ]; then
  echo "You are not logged in to Firebase. Please login with your Google account."
  firebase login
fi

# Try to get project ID from .firebaserc
if [ -f ".firebaserc" ]; then
  PROJECT_ID=$(grep -o '"default": "[^"]*' .firebaserc | cut -d'"' -f4)
  if [ ! -z "$PROJECT_ID" ]; then
    FIREBASE_PROJECT_ID=$PROJECT_ID
    echo "Using project ID from .firebaserc: $FIREBASE_PROJECT_ID"
  fi
fi

# If still not set, try to get it from .env
if [ -z "$FIREBASE_PROJECT_ID" ]; then
  if [ -f ".env" ]; then
    PROJECT_ID=$(grep -o 'VITE_FIREBASE_PROJECT_ID=[^"]*' .env | cut -d'=' -f2)
    if [ ! -z "$PROJECT_ID" ]; then
      FIREBASE_PROJECT_ID=$PROJECT_ID
      echo "Using project ID from .env: $FIREBASE_PROJECT_ID"
    fi
  fi
fi
  
# If still not set, ask the user
if [ -z "$FIREBASE_PROJECT_ID" ]; then
  echo "Enter your Firebase project ID:"
  read FIREBASE_PROJECT_ID
fi

# Initialize Firebase with project ID
echo "Setting Firebase project to: $FIREBASE_PROJECT_ID"
firebase use $FIREBASE_PROJECT_ID

# Copy Firestore rules from firebase-rules.txt
echo "Preparing Firestore rules..."
cat firebase-rules.txt | sed -n '/^service cloud.firestore {/,/^}/p' > firestore.rules

# Copy Storage rules from firebase-rules.txt
echo "Preparing Storage rules..."
cat firebase-rules.txt | sed -n '/^service firebase.storage {/,/^}/p' > storage.rules

# Deploy Firestore rules only
echo "Deploying Firestore rules..."
firebase deploy --only firestore:rules

# Deploy Storage rules only
echo "Deploying Storage rules..."
firebase deploy --only storage:rules

echo "✅ Firebase rules successfully deployed!"