# Sử dụng Node.js base image
FROM node:16

# Tạo và chuyển vào thư mục app
WORKDIR /usr/src/app

# Copy package files và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ code vào container
COPY . .

# Expose port
EXPOSE 3006

# Lệnh chạy ứng dụng
CMD ["npm", "start"]

