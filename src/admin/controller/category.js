// +----------------------------------------------------------------------
// | CmsWing [ 网站内容管理框架 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2015 http://www.cmswing.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: arterli <arterli@qq.com>
// +----------------------------------------------------------------------
'use strict';

import Base from './base.js';

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */

    init(http){
        super.init(http);
        this.db = this.model('category');
        this.tactive = "article";
    }
    async indexAction(){

        //auto render template file index_index.html
         let tree = await this.db.gettree(0,"id,name,title,sort,pid,allow_publish,status");
        //console.log(tree)
         this.assign("list",tree)
         this.meta_title = "栏目管理";
        
        return this.display();

    }
    async gettreeAction(){
        let tree = await this.db.gettree(0,"id,name,title,sort,pid,allow_publish,status");
        return this.json(tree);
    }

    /**
     * 添加栏目
     */
    async addAction(){
        if(this.isPost()){
            let data = this.post();
            data.status = 1;
            console.log(data);
            if(!think.isEmpty(data.name)){
                let check = await this.model("category").where({name:data.name,pid:data.pid}).find();
                if(!think.isEmpty(check)){
                    return this.fail("同节点下,分类标示不能重复");
                }
            }
            let res = await this.model("category").updates(data);
            if(res){
                this.success({name:"新增成功！",url:"/admin/category/index"});
            }else {
                this.fail("更新失败！");
            }
        }else{
            let sortid = await this.model("typevar").getField("sortid");
            let type;
            if(!think.isEmpty(sortid)){
                sortid = unique(sortid);
                console.log(sortid);
                //获取分类信息
                type= await this.model("type").where({typeid:['IN',sortid]}).order('displayorder ASC').select();
            }

            this.assign("typelist",type);
            //获取模型信息；
            let model = await this.model("model").get_document_model();
            //console.log(obj_values(model));
            this.assign("models",obj_values(model));
            //获取运行的文档类型
            this.active="admin/category/index";
            this.action = "/admin/category/add";
            //获取模版列表
            let temp = await this.model("temp").where({type:1}).select();
            //封面模版
            let template_index =[]
            for(let v of temp){
                let obj = {}
                let action = v.action.split("_")
                //console.log(action[1]);
                if(action[0]=='index' && action[1] != undefined && v.controller=='topic'){
                    obj.name=v.name;
                    obj.action=action[1]+this.config("view.file_ext");
                    template_index.push(obj);
                }

            }
            //列表模版
            let template_lists =[]
            for(let v of temp){
              let obj = {}
                let action = v.action.split("_");
                //console.log(action[1]);
                if(action[0]=='list' && action[1] != undefined && v.controller=='topic'){
                    obj.name=v.name;
                    obj.action=action[1]+this.config("view.file_ext");
                    template_lists.push(obj);
                }

            }
            //详情页模版
            let template_detail =[];
            for(let v of temp){
                let obj ={};
                let action = v.action.split("_");
                if(action[0]=='detail' && action[1] != undefined && v.controller=='topic'){
                    obj.name=v.name;
                    obj.action=action[1]+this.config("view.file_ext");
                    template_detail.push(obj);
                }
            }
            this.assign({
                template_lists:template_lists,
                template_detail:template_detail,
                template_index:template_index
            })
            //template_lists
            this.meta_title = "添加分类"
            return this.display();
        }

    }

    /**编辑分类
     *
     */
    async editAction(){
       let category = this.model("category");
        if(this.isPost()){
            let data = this.post();
            data.status = 1;
            console.log(data);
            //检查同节点下分类标示是否重复
            if(!think.isEmpty(data.name)){
             let check = await this.model("category").where({id:["!=",data.id],name:data.name,pid:data.pid}).find();
                if(!think.isEmpty(check)){
                    return this.fail("同节点下,分类标示不能重复");
                }
            }
            let res = await this.model("category").updates(data);
            if(res){
                this.success({name:"更新成功！",url:"/admin/category/index"});
            }else {
                this.fail("更新失败！");
            }
        }else {
          let id = this.get("cid");
           //console.log(id);
            //获取分类信息
            let info = await category.find(id);
            this.assign("info",info);
            console.log(info);
            if(!think.isEmpty(info.documentsorts)){
                let types = JSON.parse(info.documentsorts);
                let typeobj = {};
                for(let val of types.types){
                    typeobj[val.enable]=val
                }
                this.assign("typeobj",typeobj)
            }

            let sortid = await this.model("typevar").getField("sortid");
            let type;
            if(!think.isEmpty(sortid)){
                sortid = unique(sortid);
                console.log(sortid);
                //获取分类信息
                type= await this.model("type").where({typeid:['IN',sortid]}).order('displayorder ASC').select();
            }

            this.assign("typelist",type);
            //获取模型信息；
            let model = await this.model("model").get_document_model();
            //console.log(obj_values(model));
            this.assign("models",obj_values(model));
            this.active="admin/category/index";
                this.action = "/admin/category/edit";
                this.meta_title = "编辑栏目";
            //获取模版列表
            let temp = await this.model("temp").where({type:1}).select();
            //封面模版
            let template_index =[]
            for(let v of temp){
                let obj = {}
                let action = v.action.split("_")
                //console.log(action[1]);
                if(action[0]=='index' && action[1] != undefined && v.controller=='topic'){
                    obj.name=v.name;
                    obj.action=action[1]+this.config("view.file_ext");
                    template_index.push(obj);
                }

            }
            //列表模版
            let template_lists =[]
            for(let v of temp){
                let obj = {}
                let action = v.action.split("_")
                //console.log(action[1]);
                if(action[0]=='list' && action[1] != undefined && v.controller=='topic'){
                    obj.name=v.name;
                    obj.action=action[1]+this.config("view.file_ext");
                    template_lists.push(obj);
                }

            }
            //详情页模版
            let template_detail =[];
            for(let v of temp){
                let obj ={};
                let action = v.action.split("_");
                if(action[0]=='detail' && action[1] != undefined && v.controller=='topic'){
                    obj.name=v.name;
                    obj.action=action[1]+this.config("view.file_ext");
                    template_detail.push(obj);
                }
            }
            this.assign({
                template_lists:template_lists,
                template_detail:template_detail,
                template_index:template_index
            })
           return this.display();
        }
    }
    //删除栏目
    async delAction(){
        let id = this.get("id");
        let confirm = this.get("confirm");
        let type = this.get("type");
        if(confirm==1){
            //查询该栏目是否包含子栏目
          let pid= await this.model("category").get_sub_category(id);
            //console.log(pid);
            let l = pid.length;
            if(l>0){
                return this.json({ok:2,info:`该栏目含有${l}子栏目`})
            }
            let count =  await this.model("document").where({category_id: id}).count("id");
           if(count==0){
               await this.model("category").delete({where:{id:id}});
               think.cache("sys_category_list",null);
               think.cache("all_category",null);
             return this.json({ok:0,info:"删除成功!"});
           }else {
               return this.json({ok:1,info:`该栏目含有${count}条内容`})
           }
        }
        if(type == "one"){
            await this.delcate(id);
            return this.json({ok:0,info:"删除成功!"});
        }else if(type == "all"){
            let pid= await this.model("category").get_sub_category(id);
            for(let v of pid){
                await this.delcate(v);
            }
            await this.delcate(id);
            return this.json({ok:0,info:"删除成功!"});
        }
        //await this.delcate(id);
        //console.log(ids);


    }
    async delcate(id){
        //查处要删除的该栏目内容的id
        let ids = await this.model("document").where({category_id:id}).getField("id");
        //查出该栏目的管理的模型
        let model_id = await this.model("category").get_category(id,"model");
        for (let v of model_id.split(",")){
            //获取该模型的表明
            let table = await this.model("model").get_table_name(v);
            //删除模型内容
            await this.model(table).where({id:["IN",ids]}).delete();
        }

        //删除分类信息
        let sort = await this.model("category").get_category(id,"documentsorts");
        if(!think.isEmpty(sort)){
            await this.model("typeoptionvar").where({fid:id}).delete();
            if(!think.isEmpty(JSON.parse(sort).types)){
                for(let v of JSON.parse(sort).types){
                    let table = `type_optionvalue${v.enable}`
                    await this.model(table).where({fid:id}).delete();
                }
            }
        }
        await this.model("category").delete({where:{id:id}});
        await this.model("document").delete({where:{category_id:id}});
        think.cache("sys_category_list",null);
        think.cache("all_category",null);
        //查处要删除的该栏目内容的id
    }
    //移动/合并栏目
    async moveAction(){
        if(this.isPost()){
        let data = this.post();
           console.log(data);
            //return false;
            //检查要移动的栏目是否包含子栏目
            let pid= await this.model("category").get_sub_category(data.source);
            //console.log(pid);
            let l = pid.length;
            if(l>0){
                return this.fail(`源栏目含有${l}个子栏目，前先删除或者移走子栏目，再进行操作！`)
            }
            //检查源栏目是否 跟目标栏目重复
            if(data.source == data.target){
                return this.fail("源栏目不能与目标栏目重复！")
            }
            if(data.target==0){
                return this.fail("请选择目标栏目！")
            }
            let source = await this.model("category").find(data.source);
            let target = await this.model("category").find(data.target);
          //获取栏目模型信息
            console.log(target);
            let s_model_id=[];
            if(!think.isEmpty(source.model)){
                s_model_id = source.model.split(",");
            }
            let t_model_id=[];
            if(!think.isEmpty(target.model)){
                t_model_id = target.model.split(",");
            }
            let ntarget=target;
            //检查源栏目与目标栏目的模型，如果相等，直接复制，如果不相等合并。
            if(!a2a(s_model_id,t_model_id)){
                ntarget.model = unique(t_model_id.concat(s_model_id)).sort().join(",")
            };
            //console.log(2222222);
            if (!think.isEmpty(source.groups) && think.isEmpty(target.groups)) {
                ntarget.groups = source.groups
            }
            if (!think.isEmpty(source.documentsorts) && think.isEmpty(target.documentsorts)) {
                ntarget.documentsorts = source.documentsorts
            }
            if (!think.isEmpty(source.documentsorts) && !think.isEmpty(target.documentsorts)){
                let a1 = JSON.parse(source.documentsorts);
                let a2 = JSON.parse(target.documentsorts);
                let o1 ={}
                for(let v of a1.types){
                    o1[v.enable]=v
                }
                let o2 ={}
                for(let v of a2.types){
                    o2[v.enable]=v
                }
                //console.log(o1);
                //console.log(o2);
                let o3 = think.extend(o1,o2);
                //console.log(o3);
                let na = [];
                for(let k in o3){
                   na.push(o3[k])
                }
                a2.types =na;
                //console.log(na);
                ntarget.documentsorts = JSON.stringify(a2);
            }

            //检查源栏目是否有分类信息和分组，如果有跳转到处理页面

                if(!think.isEmpty(source.groups) && source.groups != target.groups && !think.isEmpty(target.groups)){
                    //如果源栏目和目标栏目都有分类信息和分组，并且不相等，跳转配置页面
                    //记录栏目信息
                   await this.session("ntarget", ntarget);
                    let url= `/admin/category/moveinfo/source/${data.source}/target/${data.target}`;
                    if(data.merge == 1){
                       url= `/admin/category/moveinfo/merge/1/source/${data.source}/target/${data.target}`;
                    }
                    return this.success({"name":"源栏目与目标栏目存在不同的分组或者分类信息，转入处理页面。","url":url});
                }else {

                    //console.log(ntarget);
                    this.model("category").update(ntarget);//复制栏目信息
                    this.model("document").where({category_id: source.id}).update({category_id: ntarget.id});//移动文章
                    //如果存在分类信息移动分类信息内容
                    if(!think.isEmpty(source.documentsorts)){
                        let documentsorts = JSON.parse(source.documentsorts);
                        if(!think.isEmpty(documentsorts.types)){
                            for(let v of documentsorts.types){
                                this.model("type_optionvalue"+v.enable).where({fid: source.id}).update({fid: ntarget.id});
                                this.model("typeoptionvar").where({fid: source.id,sortid:v.enable}).update({fid: ntarget.id});
                            }
                        }
                    }
                    if(data.merge == 1){//如果合并删除源栏目
                       await this.model("category").delete({where:{id:data.source}});
                    }
                    //更新栏目缓存
                    think.cache("sys_category_list",null);
                    think.cache("all_category",null);
                    return this.success({name: "成功！",url:"/admin/category/index"})
                }

        }else {
            let from = this.get("from");
            this.assign("from",from);
            this.active="admin/category/index";
            if(this.get('merge')==1){
                this.meta_title = "合并栏目";
            }else {
                this.meta_title = "移动栏目";
            }

            return this.display();
        }

    }
    async moveinfoAction(){
        if(this.isPost()){
            let data = this.post();
            console.log(data);
            //return false;
            let source = await this.model("category").find(data.source_id);
            let ntarget = await this.session("ntarget");
            console.log(source);
            if(data.option==2){
                let arr = []
                for(let v of JSON.parse(data.data)){
                    arr.push(`\r\n${v.nid}:${v.name}`)
                }
                ntarget.groups=ntarget.groups+arr.join("");
            }
            //console.log(ntarget);
           await this.model("category").update(ntarget);//复制栏目信息

            this.model("document").where({category_id: source.id}).update({category_id: ntarget.id});//移动文章
            //如果存在分类信息移动分类信息内容
            if(!think.isEmpty(source.documentsorts)){
                let documentsorts = JSON.parse(source.documentsorts);
                if(!think.isEmpty(documentsorts.types)){
                    for(let v of documentsorts.types){
                        this.model("type_optionvalue"+v.enable).where({fid: source.id}).update({fid: ntarget.id});
                        this.model("typeoptionvar").where({fid: source.id,sortid:v.enable}).update({fid: ntarget.id});
                    }
                }
            }
            //移动分组
            let groups = JSON.parse(data.data);
            for (let v of groups){
                if(v.oid != v.nid){
                    this.model("document").where({group_id:v.oid}).update({group_id:v.nid});//移动文章
                }
            }

            if(data.merge == 1){//如果合并删除源栏目
                await this.model("category").delete({where:{id:data.source_id}});
            }
            //更新栏目缓存
            think.cache("sys_category_list",null);
            think.cache("all_category",null);
            return this.success({name: "成功！",url:"/admin/category/index"})
        }else {
            let data = this.get();
            console.log(data);
            let source = await this.model("category").find(data.source);
            let target = await this.session("ntarget");
            this.assign({
                source_groups:parse_type_attr(source.groups),
                target_groups:parse_type_attr(target.groups),
                source_g_s:JSON.stringify(parse_type_attr(source.groups)),
                source_name:source.title,
                target_name:target.title,
                source_id:source.id
            });
            console.log(parse_type_attr(source.groups));
            console.log(target);
            this.active="admin/category/index";

            if(data.merge==1){
                this.meta_title = "合并栏目";
            }else {
                this.meta_title = "移动栏目";
            }

            return this.display();
        }

    }
}
