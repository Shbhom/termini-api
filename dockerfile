FROM node:16-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json for efficient caching
COPY package*.json ./

# Install production dependencies only
RUN npm install

# Copy the entire application (for compilation)
COPY . .

# Run the TypeScript build command
RUN npm run build

# Second stage for the final image
FROM node:16-alpine AS final

# Set the working directory in the container
WORKDIR /app

# Copy only the compiled output from the previous stage
COPY --from=build /app/dist ./dist

# Expose port if your app listens on it
EXPOSE 5500

# Start the Node.js app
CMD ["node", "dist/index.js"]  # Replace with your app's entry point

