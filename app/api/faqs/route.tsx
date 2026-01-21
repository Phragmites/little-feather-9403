import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const startTime = performance.now();
  const timings: Record<string, number> = {};

  try {
    // 阶段1: URL 解析
    const urlParseStart = performance.now();
    const { searchParams } = new URL(request.url);
    timings['url_parse'] = performance.now() - urlParseStart;

    // 阶段2: 参数获取
    const paramGetStart = performance.now();
    const titleParam = searchParams.get('title');
    timings['param_get'] = performance.now() - paramGetStart;

    // 阶段3: 标题处理
    const titleProcessStart = performance.now();
    let title = 'Frequently Asked Questions';

    if (titleParam && typeof titleParam === 'string') {
      try {
        title = decodeURIComponent(titleParam).trim();
      } catch {
        title = titleParam.trim();
      }
    }

    // 确保 title 不为空
    if (!title || title.length === 0) {
      title = 'Frequently Asked Questions';
    }

    // 截取标题，避免过长
    const displayTitle = title.length > 60 ? title.substring(0, 60) + '...' : title;
    timings['title_process'] = performance.now() - titleProcessStart;

    // 阶段4: ImageResponse 生成
    const imageGenStart = performance.now();
    const response = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#fff',
            backgroundImage: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
            padding: '80px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            position: 'relative',
          }}
        >
          {/* Background Image - 使用 try-catch 包裹，避免 socket hang up */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://uspic4.ok.com/post/image/dc8c5bfc-a434-4ab1-b561-d1795d50cce3.jpg?ow=1224&oh=814"
            alt=""
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.3,
              zIndex: 0,
            }}
          />

          {/* Background Overlay for better text readability */}
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              zIndex: 0,
            }}
          />

          {/* Content Container */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Logo/Brand */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#1a1a1a',
                }}
              >
                ok.com
              </div>
              <div
                style={{
                  marginLeft: '16px',
                  padding: '4px 12px',
                  backgroundColor: '#e3f2fd',
                  borderRadius: '4px',
                  fontSize: '18px',
                  color: '#1976d2',
                  fontWeight: '600',
                }}
              >
                FAQ
              </div>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                lineHeight: '1.2',
                color: '#1a1a1a',
                marginBottom: '32px',
                maxWidth: '1000px',
              }}
            >
              {displayTitle}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: '32px',
                lineHeight: '1.5',
                color: '#666',
                maxWidth: '1000px',
              }}
            >
              Find answers to common questions and get help with your account, listings, and more.
            </div>
          </div>

          {/* Icon/Visual Element */}
          <div
            style={{
              position: 'absolute',
              right: '80px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '120px',
              opacity: 0.1,
              zIndex: 1,
            }}
          >
            ❓
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '80px',
              left: '80px',
              fontSize: '24px',
              color: '#999',
              zIndex: 1,
            }}
          >
            Visit ok.com for more information
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
    timings['image_generation'] = performance.now() - imageGenStart;

    // 计算总耗时
    const totalTime = performance.now() - startTime;
    timings['total'] = totalTime;

    // 输出性能统计
    console.log('[Performance] API Route Timings:', {
      ...timings,
      breakdown: {
        url_parse: `${timings['url_parse'].toFixed(2)}ms`,
        param_get: `${timings['param_get'].toFixed(2)}ms`,
        title_process: `${timings['title_process'].toFixed(2)}ms`,
        image_generation: `${timings['image_generation'].toFixed(2)}ms`,
        total: `${totalTime.toFixed(2)}ms`,
      },
    });

    return response;
  } catch (e: unknown) {
    const errorTime = performance.now() - startTime;
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    console.error('[Error] API Route failed:', {
      error: errorMessage,
      timings: {
        ...timings,
        error_occurred_at: `${errorTime.toFixed(2)}ms`,
      },
    });
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}

