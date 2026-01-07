import { createHash, createHmac } from 'node:crypto'
import OSS from 'ali-oss'

// @ts-ignore
// eslint-disable-next-line node/prefer-global/buffer
function hmacSha256(key: Buffer | string, data: string): Buffer {
  return createHmac('sha256', key).update(data, 'utf8').digest()
}

function sha256(data: string): string {
  return createHash('sha256').update(data, 'utf8').digest('hex')
}
 
function getSignatureKey(
  key: string,
  dateStamp: string,
  regionName: string,
  serviceName: string
) {
  const kDate = hmacSha256(`AWS4${key}`, dateStamp)
  const kRegion = hmacSha256(kDate, regionName)
  const kService = hmacSha256(kRegion, serviceName)
  const kSigning = hmacSha256(kService, 'aws4_request')
  return kSigning
}

export async function GenerateSignature(name: string) {
  // 初始化STS客户端
  const sts = new OSS.STS({
    accessKeyId: process.env.OSS_ACCESS_KEY_ID, // 从环境变量中获取RAM用户的AccessKey ID
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET // 从环境变量中获取RAM用户的AccessKey Secret
  })

  // 调用assumeRole接口获取STS临时访问凭证
  const result = await sts.assumeRole(process.env.OSS_STS_ROLE_ARN, '', 3600, 'yourRoleSessionName') // 从环境变量中获取RAM角色ARN，并设置临时访问凭证有效期为3600秒，角色会话名称为yourRoleSessionName可自定义

  // 提取临时访问凭证中的AccessKeyId、AccessKeySecret和SecurityToken
  const accessKeyId = result.credentials.AccessKeyId
  const accessKeySecret = result.credentials.AccessKeySecret
  const securityToken = result.credentials.SecurityToken

  const bucket = 'oss-zerkj'
  const region = 'cn-beijing'
  const host = `${bucket}.oss-${region}.aliyuncs.com`

  // 提取文件扩展名
  const fileExt = name.includes('.') ? name.substring(name.lastIndexOf('.')) : ''

  // 生成文件路径
  const date = new Date()
  const dateFolder = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(
    date.getDate()).padStart(2, '0')}`
  const fileName = `my_${Date.now()}${fileExt}`
  const filePath = `${dateFolder}/${fileName}`

  // 生成时间戳
  const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, '')
  const dateStamp = amzDate.slice(0, 8)

  // 设置签名有效期（24小时）
  const expiresIn = 86400

  // 构建 Credential
  const credentialScope = `${dateStamp}/${region}/s3/aws4_request`
  const credential = `${accessKeyId}/${credentialScope}`

  // 构建 Canonical Request
  const method = 'PUT'
  const canonicalUri = `/${filePath}`
  const signedHeaders = 'host'

  const canonicalQueryString = [
    `X-Amz-Algorithm=AWS4-HMAC-SHA256`,
    `X-Amz-Credential=${encodeURIComponent(credential)}`,
    `X-Amz-Date=${amzDate}`,
    `X-Amz-Expires=${expiresIn}`,
    `X-Amz-Security-Token=${encodeURIComponent(securityToken)}`,
    `X-Amz-SignedHeaders=${signedHeaders}`
  ].join('&')

  const canonicalHeaders = `host:${host}\n`
  const payloadHash = 'UNSIGNED-PAYLOAD'

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join('\n')

  // 构建 String to Sign
  const algorithm = 'AWS4-HMAC-SHA256'

  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    sha256(canonicalRequest)
  ].join('\n')

  // 计算签名
  const signingKey = getSignatureKey(accessKeySecret, dateStamp, region, 's3')
  const signature = hmacSha256(signingKey, stringToSign).toString('hex')

  // 构建最终的签名URL
  const signedUrl = `https://${host}${canonicalUri}?${canonicalQueryString}&X-Amz-Signature=${signature}`

  // 生成访问URL(不带签名参数)
  const fileUrl = `https://${host}/${filePath}`

  return {
    uploadUrl: signedUrl,
    url: fileUrl,
    path: filePath
  }
}
