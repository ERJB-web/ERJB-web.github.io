# SNA des traces de references du 211 : aucune interaction simulee.
# Usage : Rscript analyse_sna.R donnees.json sorties
# Packages : igraph, jsonlite, svglite, digest; sna pour verification croisee.
# Methodes : Latapy et al. (2008); Blondel et al. (2008); documentation igraph.
invisible(Sys.setlocale('LC_ALL','English_United States.utf8'))
suppressPackageStartupMessages(library(igraph))
args <- commandArgs(trailingOnly=TRUE)
input <- if(length(args)) args[1] else 'donnees.json'
out <- if(length(args)>1) args[2] else 'sorties_sna'
dir.create(out,recursive=TRUE,showWarnings=FALSE)
for(x in c('graphes','mesures','figures'))dir.create(file.path(out,x),showWarnings=FALSE)
d <- jsonlite::fromJSON(input,simplifyVector=FALSE)
areas<-unlist(d$areas); years<-unlist(d$years); domains<-unlist(d$categories)
short<-c('Alimentation','Aide matérielle','Bénévolat','Éducation','Emploi / revenu','Information','Justice / sécurité','Logement','Santé','Santé mentale','Gouvernement','Soutien social','Loisirs','Transport')
records<-function(x,n){a<-as.data.frame(do.call(rbind,lapply(x,unlist)),stringsAsFactors=FALSE);names(a)<-n;a$weight<-as.numeric(a$weight);a}
age<-records(d$age_edges,c('area','year','id','weight'))
cat<-records(d$category_edges,c('area','year','domain','id','weight'))
stopifnot(all(age$weight>0),all(cat$weight>0),all(age$weight==floor(age$weight)),all(cat$weight==floor(cat$weight)),!anyDuplicated(age[1:3]),!anyDuplicated(cat[1:4]))
name_org<-function(ids) unname(vapply(ids,function(x)d$organisms[[x]],''))
csv<-function(x,name)write.csv2(x,file.path(out,'mesures',paste0(name,'.csv')),row.names=FALSE,fileEncoding='UTF-8')
archive<-function(g,key,type){write_graph(g,file.path(out,'graphes',paste0(key,'_',type,'.graphml')),format='graphml');saveRDS(g,file.path(out,'graphes',paste0(key,'_',type,'.rds')))}
cols<-c('#176B91','#D67A25','#568447','#9861AB','#C34D68','#3C9190','#A78A28','#647A94','#903F40','#295F48','#774E95','#BD6054','#3759A0','#79773B')
palette_group<-function(x) cols[(x-1)%%length(cols)+1]
device<-function(key,type,w=10,h=7){svglite::svglite(file.path(out,'figures',paste0(key,'_',type,'.svg')),width=w,height=h,bg='white');par(mar=c(1.2,1,1.2,1),family='sans')}
summary_rows<-list(); output<-list(); check<-list()
for(ai in seq_along(areas))for(yi in seq_along(years)){
  key<-paste0('a',ai,'_y',yi);a<-subset(age,area==ai-1 & year==yi-1);a<-a[order(-a$weight,a$id),]
  ego<-graph_from_data_frame(data.frame(from='211',to=paste0('O',a$id),weight=a$weight),directed=TRUE)
  V(ego)$label<-c('211',name_org(a$id));archive(ego,key,'ego')
  p<-a$weight/sum(a$weight); top<-head(a,8);n<-nrow(top)
  xy<-rbind(c(-.75,0),cbind(rep(.45,n),seq(.88,-.88,length.out=n)))
  small<-induced_subgraph(ego,c('211',paste0('O',top$id)))
  # igraph calcule le graphe complet; ce sous-graphe sert uniquement a la lecture.
  device(key,'ego',10,7);plot(small,layout=xy,rescale=FALSE,xlim=c(-1,1),ylim=c(-1,1),vertex.label=c('211',seq_len(n)),vertex.size=c(37,rep(21,n)),vertex.color=c('#173F55',rep('#176B91',n)),vertex.frame.color='white',vertex.label.color='white',vertex.label.cex=1.25,edge.width=1+sqrt(E(small)$weight),edge.color='#8DB4C6',edge.arrow.size=.65,edge.curved=0,edge.label=E(small)$weight,edge.label.cex=1.15,edge.label.color='#244B61');dev.off()
  # Verification independante du degre ego avec sna, sans poids ni boucles.
  cross<-NA_real_;if(requireNamespace('sna',quietly=TRUE)){adj<-as.matrix(as_adjacency_matrix(ego,sparse=FALSE));cross<-unname(sna::degree(adj,gmode='digraph',cmode='outdegree')[1]);stopifnot(cross==nrow(a))}
  check[[key]]<-data.frame(key,degree_igraph=degree(ego,'211',mode='out'),degree_sna=cross,strength_igraph=strength(ego,'211',mode='out'),sum_input=sum(a$weight),stringsAsFactors=FALSE)
  stopifnot(strength(ego,'211',mode='out')==sum(a$weight),degree(ego,'211',mode='out')==nrow(a))
  ego_nodes<-data.frame(id=a$id,name=name_org(a$id),in_degree=1,in_strength=a$weight,share=p);csv(ego_nodes,paste0(key,'_ego_destinataires'))
  # Deux modes : domaines AIRS et identifiants de destinataires. Tous ages.
  c<-subset(cat,area==ai-1 & year==yi-1);ids<-sort(unique(c$id));B<-matrix(0,14,length(ids),dimnames=list(paste0('D',0:13),paste0('O',ids)))
  for(i in seq_len(nrow(c)))B[as.integer(c$domain[i])+1,match(c$id[i],ids)]<-c$weight[i]
  bip<-graph_from_biadjacency_matrix(B,weighted=TRUE,directed=FALSE)
  V(bip)$label<-c(domains,name_org(ids));archive(bip,key,'biparti')
  stopifnot(is_bipartite(bip),ecount(bip)==sum(B>0),sum(E(bip)$weight)==sum(B))
  bnodes<-data.frame(id=V(bip)$name,name=V(bip)$label,mode=ifelse(V(bip)$type,'organisme','domaine'),degree=degree(bip),strength=strength(bip))
  csv(bnodes,paste0(key,'_biparti_noeuds'));csv(data.frame(domain=domains,degree=rowSums(B>0),strength=rowSums(B)),paste0(key,'_domaines'))
  pick<-head(order(-colSums(B),colnames(B)),12);display_b<-graph_from_biadjacency_matrix(B[,pick,drop=FALSE],weighted=TRUE)
  bx<-rbind(cbind(rep(-.6,14),seq(.92,-.92,length.out=14)),cbind(rep(.6,length(pick)),seq(.92,-.92,length.out=length(pick))))
  device(key,'biparti',10,8);plot(display_b,layout=bx,rescale=FALSE,xlim=c(-1,1),ylim=c(-1,1),vertex.label=c(paste0('D',1:14),paste0('O',seq_along(pick))),vertex.shape=c(rep('square',14),rep('circle',length(pick))),vertex.color=c(rep('#D67A25',14),rep('#176B91',length(pick))),vertex.size=18,vertex.frame.color='white',vertex.label.color='white',vertex.label.cex=1.1,edge.width=.6+sqrt(E(display_b)$weight)/2,edge.color=adjustcolor('#568CA4',alpha.f=.50),edge.curved=0);dev.off()
  # Projection sur les DOMAINES : voisins communs dans le biparti binaire.
  # Un lien derive n'est pas une interaction sociale ou une concomitance individuelle.
  common<-tcrossprod(B>0);diag(common)<-0
  proj<-bipartite_projection(bip,multiplicity=TRUE,which='false')
  stopifnot(all(as.matrix(as_adjacency_matrix(proj,attr='weight',sparse=FALSE))==common))
  jac<-similarity(bip,vids=V(bip)[!type],method='jaccard',loops=FALSE);diag(jac)<-0
  variants<-list()
  for(tau in c(0,.1,.2)){
    J<-jac;J[J<tau]<-0;pg<-graph_from_adjacency_matrix(J,mode='undirected',weighted=TRUE,diag=FALSE);V(pg)$label<-domains
    best<-NULL;qs<-numeric(20);mems<-list()
    for(seed in 1:20){set.seed(1800+seed);cl<-cluster_louvain(pg,weights=E(pg)$weight,resolution=1);qs[seed]<-modularity(cl);mems[[seed]]<-membership(cl);if(is.null(best)||(is.finite(qs[seed])&&(!is.finite(modularity(best))||qs[seed]>modularity(best))))best<-cl}
    member<-membership(best);bt<-betweenness(pg,directed=FALSE,weights=1/E(pg)$weight,normalized=TRUE)
    set.seed(20261018);lay<-layout_with_fr(pg,weights=E(pg)$weight,niter=2000);lay<-norm_coords(lay,xmin=-.82,xmax=.82,ymin=-.82,ymax=.82)
    V(pg)$community<-as.integer(member);V(pg)$betweenness<-as.numeric(bt);V(pg)$x<-lay[,1];V(pg)$y<-lay[,2]
    mode_key<-paste0('projection_',round(tau*100));archive(pg,key,mode_key)
    edge_df<-as_data_frame(pg,what='edges');edge_df$common_recipients<-vapply(seq_len(nrow(edge_df)),function(k)common[match(edge_df$from[k],rownames(common)),match(edge_df$to[k],colnames(common))],0)
    nodes<-data.frame(code=paste0('D',1:14),name=domains,short=short,degree=degree(pg),strength=strength(pg),betweenness=as.numeric(bt),community=as.integer(member),recipients=rowSums(B>0))
    csv(nodes,paste0(key,'_',mode_key,'_noeuds'));csv(edge_df,paste0(key,'_',mode_key,'_liens'))
    device(key,mode_key,10,8);plot(pg,layout=lay,rescale=FALSE,xlim=c(-1,1),ylim=c(-1,1),vertex.label=paste0('D',1:14),vertex.color=palette_group(member),vertex.frame.color='white',vertex.label.color='white',vertex.label.cex=1.2,vertex.size=20+25*sqrt(bt),edge.width=.8+5*E(pg)$weight,edge.color=adjustcolor('#647D8E',alpha.f=.35),edge.curved=.10);dev.off()
    ari<-vapply(mems,function(m)compare(member,m,method='adjusted.rand'),0)
    variants[[as.character(tau)]]<-list(threshold=tau,nodes=nodes,edges=edge_df,components=components(pg)$no,communities=length(unique(member)),modularity=modularity(best),modularity_min=if(any(is.finite(qs)))min(qs[is.finite(qs)]) else NA_real_,modularity_max=if(any(is.finite(qs)))max(qs[is.finite(qs)]) else NA_real_,ari_min=min(ari),ari_mean=mean(ari),transitivity=transitivity(pg,type='global'),figure=paste0(key,'_',mode_key,'.svg'))
  }
  btable<-data.frame(code=paste0('O',seq_along(pick)),id=ids[pick],name=name_org(ids[pick]),degree=colSums(B>0)[pick],strength=colSums(B)[pick])
  stats<-list(recipients=nrow(a),references=sum(a$weight),top5_share=sum(head(p,5)),effective_recipients=1/sum(p^2),biparti_domains=14,biparti_orgs=ncol(B),biparti_edges=ecount(bip),biparti_references=sum(B),biparti_density=ecount(bip)/(14*ncol(B)),biparti_components=components(bip)$no)
  output[[key]]<-list(area=areas[ai],year=years[yi],stats=stats,ego_top=transform(head(ego_nodes,8),code=as.character(1:8)),ego_coverage=sum(top$weight)/sum(a$weight),biparti_top=btable,biparti_coverage=sum(B[,pick])/sum(B),domains=data.frame(code=paste0('D',1:14),name=domains,short=short,degree=rowSums(B>0),strength=rowSums(B)),projection=variants)
  summary_rows[[key]]<-data.frame(key,area=areas[ai],year=years[yi],as.data.frame(stats),stringsAsFactors=FALSE)
}
# Reseaux longitudinaux : meme ego, memes identifiants, trois couches temporelles.
temporal<-list()
for(ai in seq_along(areas)){
  a<-subset(age,area==ai-1);ids<-sort(unique(a$id));M<-matrix(0,length(ids),3,dimnames=list(ids,years));for(i in seq_len(nrow(a)))M[a$id[i],as.integer(a$year[i])+1]<-a$weight[i]
  ord<-head(order(-rowSums(M),rownames(M)),10);codes<-paste0('O',seq_along(ord));x<-c(-.75,0,.75);y<-seq(.88,-.88,length.out=10)
  device(paste0('a',ai),'temporel',11,8);plot.new();plot.window(xlim=c(-1,1),ylim=c(-1.03,1.03),xaxs='i',yaxs='i')
  for(i in seq_along(ord))for(j in 1:2)if(M[ord[i],j]>0&&M[ord[i],j+1]>0)segments(x[j],y[i],x[j+1],y[i],col=adjustcolor('#176B91',.5),lwd=1+sqrt(min(M[ord[i],j],M[ord[i],j+1])))
  for(j in 1:3){text(x[j],1,years[j],cex=1.2,font=2,col='#173F55');for(i in seq_along(ord)){w<-M[ord[i],j];points(x[j],y[i],pch=21,bg=if(w>0)'#176B91' else 'white',col=if(w>0)'#176B91' else '#B4BCC3',cex=if(w>0)2+sqrt(w)/3 else 1.7);text(x[j]+.1,y[i],if(w>0)as.character(w) else '—',adj=0,cex=1.05,col='#173F55')}}
  text(rep(-.97,10),y,codes,cex=1.1,adj=0,font=2,col='#173F55');dev.off()
  transitions<-lapply(1:2,function(j){u<-M[,j]>0;v<-M[,j+1]>0;list(from=years[j],to=years[j+1],retained=sum(u&v),appeared=sum(!u&v),not_reobserved=sum(u&!v),jaccard=sum(u&v)/sum(u|v),weighted_jaccard=sum(pmin(M[,j],M[,j+1]))/sum(pmax(M[,j],M[,j+1])))})
  allrows<-data.frame(id=ids,name=name_org(ids),M,check.names=FALSE);csv(allrows,paste0('a',ai,'_temporel'))
  temporal[[paste0('a',ai)]]<-list(top=data.frame(code=codes,id=ids[ord],name=name_org(ids[ord]),M[ord,,drop=FALSE],check.names=FALSE),transitions=transitions,figure=paste0('a',ai,'_temporel.svg'),union=length(ids),persistent_all=sum(rowSums(M>0)==3),display_references=sum(M[ord,]),total_references=sum(M))
}
csv(do.call(rbind,summary_rows),'synthese');csv(do.call(rbind,check),'controle_igraph_sna')
result<-list(software=list(R=as.character(getRversion()),igraph=as.character(packageVersion('igraph')),sna=as.character(packageVersion('sna'))),input_sha256=digest::digest(readBin(input,'raw',n=file.info(input)$size),algo='sha256',serialize=FALSE),areas=areas,years=years,domains=domains,analyses=output,temporal=temporal,provenance=d$provenance)
jsonlite::write_json(result,file.path(out,'analyses.json'),auto_unbox=TRUE,digits=8,pretty=FALSE,na='null')
saveRDS(result,file.path(out,'resultats_complets.rds'));writeLines(capture.output(sessionInfo()),file.path(out,'sessionInfo.txt'))
message('Termine : ',length(output),' contextes; controles igraph/sna reussis; ',length(list.files(file.path(out,'graphes'))),' objets de graphes.')

