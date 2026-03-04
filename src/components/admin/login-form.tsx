/**
 * 관리자 로그인 폼 컴포넌트
 * React Hook Form + Zod를 사용한 타입 안전한 폼 검증
 */

'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { adminLoginSchema } from '@/types/admin'
import { adminLogin } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, AlertCircle, Loader2 } from 'lucide-react'
import type { z } from 'zod'

// 폼 입력값 타입
type AdminLoginFormInputs = z.infer<typeof adminLoginSchema>

/**
 * 관리자 로그인 폼 컴포넌트
 */
export function AdminLoginForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdminLoginFormInputs>({
    resolver: zodResolver(adminLoginSchema),
    mode: 'onBlur',
  })

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = (data: AdminLoginFormInputs) => {
    setServerError(null)

    startTransition(async () => {
      try {
        // Server Action 호출
        const result = await adminLogin(data.password)

        if (result.success) {
          // 로그인 성공 - 대시보드로 리다이렉트
          reset()
          router.push('/dashboard/invoices')
        } else {
          // 로그인 실패
          setServerError(result.error || '로그인에 실패했습니다')
        }
      } catch (error) {
        console.error('로그인 중 오류:', error)
        setServerError('로그인 처리 중 오류가 발생했습니다')
      }
    })
  }

  return (
    <div className="w-full max-w-md">
      {/* 폼 제목 */}
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-lg bg-blue-50 p-3">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">관리자 로그인</h1>
        <p className="mt-2 text-sm text-gray-600">
          견적서 관리 대시보드에 접근하려면 로그인해주세요
        </p>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 서버 오류 메시지 */}
        {serverError && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
            <p className="text-sm text-red-700">{serverError}</p>
          </div>
        )}

        {/* 비밀번호 입력 필드 */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            비밀번호
          </label>
          <Input
            id="password"
            type="password"
            placeholder="관리자 비밀번호를 입력하세요"
            disabled={isPending}
            {...register('password')}
            className={errors.password ? 'border-red-500' : ''}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* 로그인 버튼 */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              로그인 중...
            </>
          ) : (
            '로그인'
          )}
        </Button>
      </form>

      {/* 안내 문구 */}
      <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-xs text-blue-700">
          💡 <strong>개발용:</strong> 관리자 비밀번호는 환경변수{' '}
          <code className="rounded bg-white px-2 py-1 text-blue-900">
            ADMIN_PASSWORD_HASH
          </code>
          에 bcryptjs로 해시된 형태로 저장됩니다.
        </p>
      </div>
    </div>
  )
}
