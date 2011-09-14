package dev.quiz; 

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.os.RemoteException;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.TextView;

import com.google.android.apps.gddquiz.IQuizService;

public class DevquizActivity extends Activity {
	private Button getButton = null;
	private TextView textView = null;
	private IQuizService sampleServiceIf;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);
        Intent intent = new Intent(IQuizService.class.getName());
        bindService(
                intent,
                sampleServiceConn,
                BIND_AUTO_CREATE
        );
		getButton = (Button)findViewById(R.id.service_start_button);
		textView = (TextView)findViewById(R.id.textView1);
		getButton.setOnClickListener(new OnClickListener(){
            public void onClick(View v) {
            	try {
					textView.setText(sampleServiceIf.getCode());
				} catch (RemoteException e) {
					e.printStackTrace();
				}
        	}
        });
	}
	
	/**
     * Serviceに接続・切断
     */
    public ServiceConnection sampleServiceConn = new ServiceConnection(){

        /**
         * サービスに接続
         */
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            // サービスIFを取得する
            // このIFを使ってサービスとやり取りする
            sampleServiceIf = IQuizService.Stub.asInterface(service);
        }

        /**
         * サービスから切断
         */
        @Override
        public void onServiceDisconnected(ComponentName name) {
            sampleServiceIf = null;
        }
    };
}                                                     
