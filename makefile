APPID	:= com.chrismondok.cumulus
VERSION	:= 0.1.$(shell git log --pretty=format:'' | wc -l )
IPK		:= $(APPID)_$(VERSION)_all.ipk

sourcefiles := $(wildcard source/*.js)

deploy/cumulus: $(sourcefiles)
	./tools/deploy.sh

deploy/cumulus/appinfo.json: deploy/cumulus
	sed -e s/{VERSION}/$(VERSION)/ < appinfo.json > deploy/cumulus/appinfo.json

deploy/$(IPK): deploy/cumulus deploy/cumulus/appinfo.json
	palm-package -o deploy deploy/cumulus

webos: deploy/$(IPK)

install-webos: deploy/$(IPK)
	palm-install deploy/$(IPK)

clean:
	rm -rf deploy/* build/*
