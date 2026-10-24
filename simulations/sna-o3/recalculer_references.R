# Illustration O3 using observed 211 referral counts, not SAD collaboration.
# Run in the folder containing the public donnees.json export.
invisible(try(Sys.setlocale("LC_ALL","English_United States.utf8"),silent=TRUE))
packages<-c("igraph","jsonlite");missing<-packages[!vapply(packages,requireNamespace,logical(1),quietly=TRUE)]
if(length(missing))install.packages(missing,repos="https://cloud.r-project.org")
d<-jsonlite::fromJSON("donnees.json",simplifyVector=FALSE)
rows<-do.call(rbind,lapply(d$age_edges,function(r)data.frame(area=d$areas[[r[[1]]+1]],year=d$years[[r[[2]]+1]],id=r[[3]],references=r[[4]])))
result<-list()
for(yr in unlist(d$years))for(ar in unlist(d$areas)){
 x<-rows[rows$area==ar&rows$year==yr,]
 g<-igraph::graph_from_data_frame(data.frame(from="211",to=x$id,weight=x$references),directed=TRUE)
 stopifnot(igraph::strength(g,v="211",mode="out")==sum(x$references),igraph::degree(g,v="211",mode="out")==nrow(x))
 p<-x$references/sum(x$references)
 result[[paste(yr,ar)]]<-data.frame(area=ar,year=yr,recipients=nrow(x),references=sum(x$references),top5_share=sum(head(sort(p,decreasing=TRUE),5)),hhi=sum(p^2),effective_recipients=1/sum(p^2))
}
write.csv(do.call(rbind,result),"indicateurs_211_recalcules.csv",row.names=FALSE)
write.csv(rows,"dyades_211_observees.csv",row.names=FALSE)
category_rows<-do.call(rbind,lapply(d$category_edges,function(r)data.frame(area=d$areas[[r[[1]]+1]],year=d$years[[r[[2]]+1]],category=d$categories[[r[[3]]+1]],id=r[[4]],references=r[[5]])))
bipartite<-list();overlap<-list();temporal<-list()
for(yr in unlist(d$years))for(ar in unlist(d$areas)){
 x<-category_rows[category_rows$area==ar&category_rows$year==yr,]
 mat<-xtabs(references~category+id,x);mat<-matrix(as.numeric(mat),nrow=nrow(mat),dimnames=dimnames(mat))
 g<-igraph::graph_from_biadjacency_matrix(mat,weighted=TRUE)
 stopifnot(igraph::is_bipartite(g),sum(igraph::E(g)$weight)==sum(x$references))
 bipartite[[paste(yr,ar)]]<-data.frame(area=ar,year=yr,categories=nrow(mat),recipients=ncol(mat),dyads=sum(mat>0),references=sum(mat))
}
for(yr in unlist(d$years))for(pair in combn(unlist(d$areas),2,simplify=FALSE)){
 x<-rows[rows$area==pair[1]&rows$year==yr,];y<-rows[rows$area==pair[2]&rows$year==yr,]
 overlap[[paste(yr,pair,collapse="_")]]<-data.frame(year=yr,from=pair[1],to=pair[2],shared=length(intersect(x$id,y$id)),jaccard=length(intersect(x$id,y$id))/length(union(x$id,y$id)))
}
for(ar in unlist(d$areas))for(i in 2:length(d$years)){
 x<-rows$id[rows$area==ar&rows$year==d$years[[i-1]]];y<-rows$id[rows$area==ar&rows$year==d$years[[i]]]
 temporal[[paste(ar,i)]]<-data.frame(area=ar,from_year=d$years[[i-1]],to_year=d$years[[i]],retained=length(intersect(x,y)),new_in_file=length(setdiff(y,x)),not_reobserved=length(setdiff(x,y)),jaccard=length(intersect(x,y))/length(union(x,y)))
}
write.csv(do.call(rbind,bipartite),"reseaux_bipartis_recalcules.csv",row.names=FALSE)
write.csv(do.call(rbind,overlap),"destinataires_partages_recalcules.csv",row.names=FALSE)
write.csv(do.call(rbind,temporal),"evolution_recalculee.csv",row.names=FALSE)
capture.output(sessionInfo(),file="sessionInfo_recalcul.txt")
cat("Observed directed referral counts recomputed. No SAD or alter-alter interaction is inferred.\n")
