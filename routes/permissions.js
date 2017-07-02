/**
 * Created by linxiaojie on 2017/6/13.
 */
const Router = require('koa-router')
const router = new Router()
const PermissionDao = require('../dao/permission')
const permissionDao = new PermissionDao()
const getNormalError = require('../error').getNormalError
const _ = require('lodash')

router.param('permission', async (id, cxt, next) => {
  let permissions = await permissionDao.find({_id: permissionDao.caseObjectId(id)})
  if (_.isEmpty(permissions)) {
    throw getNormalError('权限数据不存在，请检查')
  }
  cxt.permission = permissions[0]
  return next()
})

/*
* 增加
* */
router.post('/', async (cxt) => {
  const body = cxt.request.body
  const permission = await permissionDao.add(body)
  cxt.body = permission
})

/*
 * 删除
 * */
router.del('/:id', async (cxt) => {
  const permission = await permissionDao.delete({_id: permissionDao.caseObjectId(cxt.params.id)})
  cxt.body = {}
})

router.del('/batch/:ids', async (cxt) => {
  let ids = _.map((cxt.params.ids || '').split(','), (id) => {
    return permissionDao.caseObjectId(id)
  })
  const permission = await permissionDao.delete({_id: {$in: ids}})
  cxt.body = {}
})

/*
* 修改
* */
router.post('/:id', async (cxt) => {
  const body = cxt.request.body
  const permission = await permissionDao.update({_id: permissionDao.caseObjectId(cxt.params.id)}, body)
  cxt.body = {}
})

/*
* 搜索
* */
router.get('/', async (cxt) => {
  const name = cxt.query['name']
  let list = await permissionDao.pageQuery({queryParam: {name: {$regex: decodeURIComponent(name)}, status: false}})
  cxt.body = list
})

/*
* 获取详情
* */
router.get('/:permission', async (cxt) => {
  cxt.body = {
    permission: cxt.permission
  }
})


module.exports = router