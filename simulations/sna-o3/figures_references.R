invisible(Sys.setlocale('LC_ALL','English_United States.utf8'))
library(igraph)
d <- jsonlite::fromJSON('donnees.json',simplifyVector=FALSE)
out <- 'figures'
dir.create(out,showWarnings=FALSE)
edges <- as.data.frame(do.call(rbind,lapply(d$age_edges,unlist)),stringsAsFactors=FALSE)
names(edges) <- c('area','year','id','weight'); edges$weight <- as.numeric(edges$weight)
cats <- as.data.frame(do.call(rbind,lapply(d$category_edges,unlist)),stringsAsFactors=FALSE)
names(cats)<-c('area','year','category','id','weight');cats$weight<-as.numeric(cats$weight)
nm <- function(id) unname(vapply(id,function(x) d$organisms[[x]],''))
wrap <- function(s,n=32) vapply(s,function(x) paste(strwrap(x,n),collapse='\n'),'')
openfig <- function(name,title,subtitle){svglite::svglite(file.path(out,paste0(name,'.svg')),width=13,height=8.5,bg='#ffffff');par(mar=c(2,2,5,2),family='sans',fg='#203b48');plot.new();plot.window(xlim=c(0,1),ylim=c(0,1),xaxs='i',yaxs='i');title(main=title,sub='',adj=0,cex.main=1.35);mtext(subtitle,side=3,line=1,adj=0,cex=.86,col='#536875')}
v<-subset(edges,area=='0' & year=='1');v<-v[order(-v$weight,v$id),];top<-head(v,12)
g<-graph_from_data_frame(data.frame(from='211',to=top$id,weight=top$weight),directed=TRUE)
stopifnot(ecount(g)==12,sum(v$weight)==512,nrow(v)==210)
openfig('01-ego-211','1. Réseau égocentré : 211 → organismes','Verdun · 2024–2025 · classes 60–69 et 70+ · 12 destinataires les plus référencés sur 210')
y<-seq(.94,.05,length.out=12);for(i in 1:12){arrows(.13,.5,.412,y[i],length=.07,lwd=1+top$weight[i]/5,col='#9bbfcb');points(.43,y[i],pch=21,bg='#087d91',col='white',cex=2);text(.48,y[i],paste0(wrap(nm(top$id[i]),59),'  [',top$weight[i],']'),adj=0,cex=.79)}
points(.13,.5,pch=21,cex=8,bg='#123f59',col='white');text(.13,.5,'211',col='white',font=2,cex=1.5)
mtext('Épaisseur = nombre de références. Liens entre organismes : non observés.',side=1,line=1,adj=0,cex=.8);dev.off()
c<-subset(cats,area=='0' & year=='1');tot<-aggregate(weight~id,c,sum);tot<-tot[order(-tot$weight,tot$id),];ids<-head(tot$id,8);c<-subset(c,id %in% ids);cs<-sort(unique(as.integer(c$category)));yl<-seq(.93,.07,length.out=length(cs));yr<-seq(.93,.07,length.out=length(ids))
openfig('02-biparti','2. Réseau biparti : besoins × organismes','Verdun · 2024–2025 · extraction TOUS ÂGES · 8 destinataires les plus référencés')
for(i in seq_len(nrow(c))){a<-match(as.integer(c$category[i]),cs);b<-match(c$id[i],ids);segments(.28,yl[a],.68,yr[b],lwd=.5+sqrt(c$weight[i])/2,col='#a8c9ce')}
points(rep(.28,length(cs)),yl,pch=15,col='#cb7d34',cex=1.5);text(.26,yl,wrap(unlist(d$categories)[cs+1],28),adj=1,cex=.73)
points(rep(.68,length(ids)),yr,pch=19,col='#087d91',cex=1.7);text(.70,yr,wrap(nm(ids),32),adj=0,cex=.72)
mtext('Lien = référence classée dans un domaine; aucune collaboration organisme–organisme déduite.',side=1,line=1,adj=0,cex=.8);dev.off()
e<-subset(edges,year=='1');z<-aggregate(weight~id,e,sum);z<-z[order(-z$weight,z$id),];ids<-head(z$id,12);mat<-matrix(0,12,4,dimnames=list(ids,unlist(d$areas)));for(i in seq_len(nrow(e)))if(e$id[i] %in% ids)mat[e$id[i],as.integer(e$area[i])+1]<-mat[e$id[i],as.integer(e$area[i])+1]+e$weight[i]
openfig('03-matrice','3. Matrice : origine des demandes × destinataires','2024–2025 · 60–69 et 70+ · 12 destinataires les plus référencés dans les quatre arrondissements')
pal<-colorRampPalette(c('#edf5f4','#157f94','#123f59'))(100);xs<-seq(.49,.94,length.out=4);ys<-seq(.91,.09,length.out=12)
for(i in 1:12){text(.38,ys[i],wrap(nm(ids[i]),43),adj=1,cex=.7);for(j in 1:4){val<-mat[i,j];idx<-1+floor(99*val/max(mat));rect(xs[j]-.065,ys[i]-.03,xs[j]+.065,ys[i]+.03,col=pal[idx],border='white');text(xs[j],ys[i],val,col=if(idx>48)'white' else '#173b49',cex=.9)}}
text(xs,.99,wrap(c('Verdun','Sud-Ouest','Plateau','Ville-Marie'),13),cex=.83);mtext('Cellule = références du 211 pour une origine donnée; les arrondissements ne sont pas des acteurs émetteurs.',side=1,line=1,adj=0,cex=.8);dev.off()
m<-do.call(rbind,lapply(d$metrics,function(x)data.frame(area=x$area,year=x$year,recipients=x$recipients,references=x$references)))
svglite::svglite(file.path(out,'04-evolution.svg'),width=13,height=8.5,bg='white');par(mar=c(5,5,5,2),family='sans',fg='#203b48');cols<-c('#087d91','#c17b28','#6754a0','#b24d67');plot(1:3,rep(0,3),type='n',ylim=c(180,500),xaxt='n',xlab='Exercice figurant dans les extractions',ylab='Nombre de destinataires distincts',main='4. Évolution des destinataires observés');axis(1,at=1:3,labels=unlist(d$years));abline(h=seq(200,500,50),col='#e6edef');for(i in 1:4){a<-subset(m,area==d$areas[[i]]);a<-a[match(unlist(d$years),a$year),];lines(1:3,a$recipients,type='b',lwd=3,pch=19,col=cols[i]);text(1:3,a$recipients+10,a$recipients,col=cols[i],cex=.9)};legend('topleft',legend=unlist(d$areas),col=cols,lwd=3,bty='n',cex=.85);mtext('Classes 60–69 et 70+ · couverture temporelle à vérifier avant toute interprétation de tendance',side=3,line=.5,adj=0,cex=.85);dev.off()
writeLines(c('Figures calculées à partir des mêmes extractions 211 que la galerie.',paste('R',getRversion(),'igraph',packageVersion('igraph')),'Verdun 2024-2025: 210 destinataires; 512 références identifiées; 12 sans identifiant destinataire.'),file.path(out,'verification-figures.txt'))

