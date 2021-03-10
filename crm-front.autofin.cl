server {
        server_name serverName;

        root /var/www/html/dist;

        location ~* .(static)/(js|css|media)/(.+)$ {
                try_files $uri $uri/ /$1/$2/$3 /index.html;
                #root /var/www/html/dist/;
        }

        location / {
                try_files $uri /index.html;
        }
}
